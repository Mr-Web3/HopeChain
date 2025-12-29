'use client';

import { useEffect, useState, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import deployedContracts from '@/contracts/deployedContracts';
import { LeaderboardCard } from './LeaderboardCard';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, RefreshCw } from 'lucide-react';

interface DonorData {
  address: string;
  totalDonated: bigint;
  rank: number;
  metadata?:
    | {
        name: string;
        image: string;
        attributes: Array<{
          trait_type: string;
          value: string | number;
        }>;
      }
    | undefined;
}

type DonorResult = DonorData | null;

interface LeaderboardSectionProps {
  title?: string;
  description?: string;
}

const donationVaultConfig = deployedContracts[84532].DonationVault;
const donationVaultAddress = donationVaultConfig.address as `0x${string}`;

// Create Viem client for custom RPC
const viemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
  ),
});

export function LeaderboardSection({
  title = 'Top 5 Hope Givers',
  description = 'Recognizing our most generous donors — every USDC changes a life.',
}: LeaderboardSectionProps) {
  const [donors, setDonors] = useState<DonorData[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read all donors from contract
  const { data: allDonors } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getAllDonors',
    chainId: 84532, // Base Sepolia
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      staleTime: 0,
    },
  }) as { data: string[] | undefined; refetch: () => void };

  const fetchDonorData = useCallback(
    async (isBackgroundRefresh = false) => {
      if (!allDonors || allDonors.length === 0) {
        setDonors([]);
        setIsInitialLoading(false);
        return;
      }

      if (isBackgroundRefresh) {
        setIsRefreshing(true);
      } else {
        setIsInitialLoading(true);
      }
      setError(null);

      try {
        // Get donation totals for each donor
        const donorPromises = allDonors.map(async address => {
          try {
            const totalDonated = (await viemClient.readContract({
              address: donationVaultAddress,
              abi: donationVaultConfig.abi,
              functionName: 'donorTotal',
              args: [address as `0x${string}`],
            })) as unknown as bigint;

            // Fetch metadata for badge image and tier
            let metadata;
            try {
              const metadataResponse = await fetch(`/api/metadata/${address}`);
              if (metadataResponse.ok) {
                metadata = await metadataResponse.json();
              }
            } catch (metadataError) {
              console.warn(
                `Failed to fetch metadata for ${address}:`,
                metadataError
              );
            }

            return {
              address,
              totalDonated,
              rank: 0, // Will be set after sorting
              metadata,
            };
          } catch (error) {
            console.error(`Error fetching data for ${address}:`, error);
            return null;
          }
        });

        const donorResults: DonorResult[] = await Promise.all(donorPromises);
        const validDonors = donorResults.filter(
          (donor): donor is DonorData => donor !== null
        );

        // Sort by total donated (descending)
        validDonors.sort((a, b) => {
          if (!a || !b) return 0;
          return Number(b.totalDonated) - Number(a.totalDonated);
        });

        // Set ranks with proper tie handling
        let currentRank = 1;
        let previousAmount = validDonors[0]?.totalDonated;
        
        validDonors.forEach((donor, index) => {
          if (donor) {
            // If this donor's amount is different from the previous, update the rank
            if (donor.totalDonated !== previousAmount) {
              currentRank = index + 1;
              previousAmount = donor.totalDonated;
            }
            donor.rank = currentRank;
          }
        });

        // Take top 5 only
        const topDonors = validDonors.slice(0, 5);
        setDonors(topDonors);
      } catch (error) {
        console.error('Error fetching donor data:', error);
        setError('Failed to load leaderboard data');
      } finally {
        if (isBackgroundRefresh) {
          setIsRefreshing(false);
        } else {
          setIsInitialLoading(false);
        }
      }
    },
    [allDonors]
  );

  useEffect(() => {
    fetchDonorData();
  }, [fetchDonorData]);

  // Auto-refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing leaderboard data...');
      fetchDonorData(true); // Background refresh
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [fetchDonorData]);

  if (isInitialLoading) {
    return (
      <section aria-label='Top 5 Hope Givers Leaderboard' className='py-16'>
        <div className='max-w-6xl mx-auto px-6 sm:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>{title}</h2>
            <p className='text-muted-foreground text-lg'>{description}</p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Card
                key={index}
                className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl p-6'
              >
                <CardContent className='p-0'>
                  <div className='flex flex-col items-center text-center space-y-3'>
                    <div className='w-8 h-8 bg-white/10 rounded-full animate-pulse'></div>
                    <div className='w-20 h-6 bg-white/10 rounded animate-pulse'></div>
                    <div className='w-16 h-4 bg-white/10 rounded animate-pulse'></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label='Top 5 Hope Givers Leaderboard' className='py-16'>
        <div className='max-w-6xl mx-auto px-6 sm:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-foreground mb-4'>{title}</h2>
            <p className='text-muted-foreground text-lg'>{description}</p>
          </div>

          <Card className='bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-8'>
            <CardContent className='text-center'>
              <p className='text-red-500 mb-4'>{error}</p>
              <button
                onClick={() => fetchDonorData()}
                className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section aria-label='Top Hope Givers Leaderboard' className='py-16'>
      <div className='max-w-6xl mx-auto px-6 sm:px-8'>
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <Trophy className='w-8 h-8 text-primary' />
            <h2 className='text-3xl font-bold text-foreground'>{title}</h2>
          </div>
          <p className='text-muted-foreground text-lg'>{description}</p>
        </div>

        {donors.length === 0 ? (
          <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl p-8'>
            <CardContent className='text-center'>
              <p className='text-muted-foreground'>
                No donors yet. Be the first to make a difference!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
            {donors.map((donor, index) => (
              <LeaderboardCard
                key={donor.address}
                donor={donor}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Refresh indicator */}
        <div className='text-center mt-8'>
          <p className='text-sm text-muted-foreground flex items-center justify-center space-x-2'>
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>
              {isRefreshing ? 'Refreshing...' : 'Auto-refreshing every minute'}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
