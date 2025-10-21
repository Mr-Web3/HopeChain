'use client';

import { useFrameContext } from '../components/FrameProvider';
import { useAccount, useReadContract } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import deployedContracts from '../../contracts/deployedContracts';

// Import our new components
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { StatsOverview } from '../components/profile/StatsOverview';
import { BadgeCard } from '../components/profile/BadgeCard';
import { DonationHistory } from '../components/profile/DonationHistory';
import { MonthlyStats } from '../components/profile/MonthlyStats';
import { ProfileCallToAction } from '../components/profile/ProfileCallToAction';
import { WalletRequired } from '../components/profile/WalletRequired';
import { DonationProgressChart } from '../components/profile/DonationProgressChart';

// Contract configurations
const donationVaultConfig = deployedContracts[84532].DonationVault;
const donationVaultAddress = donationVaultConfig.address as `0x${string}`;

// Create Viem client for custom RPC
const viemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
  ),
});

// SBT Badge configuration (single badge for now) - moved to BadgeCard component

// Types for donation history
interface DonationHistoryItem {
  id: number;
  amount: number;
  date: string;
  txHash: string;
  blockNumber: number;
}

// Types for monthly stats
interface MonthlyStat {
  month: string;
  amount: number;
  donations: number;
}

export default function ProfilePage() {
  const frameContext = useFrameContext();
  const isInMiniApp = frameContext?.isInMiniApp ?? false;
  const context = frameContext?.context;
  const { address, isConnected } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const [donationHistory, setDonationHistory] = useState<DonationHistoryItem[]>(
    []
  );
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userBasename, setUserBasename] = useState<string | undefined>(
    undefined
  );

  // Contract reads
  const { data: userDonationTotal } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'donorTotal',
    args: address ? [address] : undefined,
    chainId: 84532,
  });

  const { data: hasMintedBadge } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'hasMintedBadge',
    args: address ? [address] : undefined,
    chainId: 84532,
  });

  // const { data: totalDonated } = useReadContract({
  //   address: donationVaultAddress,
  //   abi: donationVaultConfig.abi,
  //   functionName: 'totalDonated',
  //   chainId: 84532,
  // });

  // Hydration check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get user basename
  useEffect(() => {
    if (address && isMounted) {
      const fetchBasename = async () => {
        try {
          // Note: getEnsName is not available in this viem version
          // For now, we'll just use the truncated address
          setUserBasename(undefined);
        } catch (error) {
          console.error('Error fetching basename:', error);
        }
      };
      fetchBasename();
    }
  }, [address, isMounted]);

  // Function to fetch donation history from blockchain events
  const fetchDonationHistory = useCallback(async () => {
    if (!address) return;

    setIsLoadingData(true);
    try {
      // Get Donated events for this user
      const logs = await viemClient.getLogs({
        address: donationVaultAddress,
        event: {
          type: 'event',
          name: 'Donated',
          inputs: [
            { indexed: true, name: 'donor', type: 'address' },
            { indexed: false, name: 'amount', type: 'uint256' },
            { indexed: false, name: 'timestamp', type: 'uint256' },
          ],
        },
        args: {
          donor: address,
        },
        fromBlock: BigInt(0),
        toBlock: 'latest',
      });

      // Process logs into donation history
      const history: DonationHistoryItem[] = logs.map((log, index) => {
        const amount = log.args.amount as bigint;
        const timestamp = log.args.timestamp as bigint;

        return {
          id: index + 1,
          amount: Number(amount),
          date: new Date(Number(timestamp) * 1000).toISOString(),
          txHash: log.transactionHash,
          blockNumber: Number(log.blockNumber),
        };
      });

      // Sort by date (newest first)
      history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setDonationHistory(history);

      // Calculate monthly stats
      const monthlyData: {
        [key: string]: { amount: number; donations: number };
      } = {};

      history.forEach(donation => {
        const date = new Date(donation.date);
        const monthKey = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { amount: 0, donations: 0 };
        }

        monthlyData[monthKey].amount += donation.amount;
        monthlyData[monthKey].donations += 1;
      });

      const monthlyStatsArray: MonthlyStat[] = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          amount: data.amount,
          donations: data.donations,
        }))
        .sort(
          (a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()
        );

      setMonthlyStats(monthlyStatsArray);
    } catch (error) {
      console.error('Error fetching donation history:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [address]);

  // Fetch donation history when address changes
  useEffect(() => {
    if (address && isMounted) {
      fetchDonationHistory();
    }
  }, [address, isMounted, fetchDonationHistory]);

  // Auto-refresh donation history every 10 seconds
  useEffect(() => {
    if (address && isMounted) {
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing profile data...');
        fetchDonationHistory();
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [address, isMounted, fetchDonationHistory]);

  // Calculate stats
  const totalDonatedAmount = userDonationTotal
    ? Number(userDonationTotal) / 1e6
    : 0; // USDC has 6 decimals
  const earnedBadges = hasMintedBadge ? 1 : 0;
  const totalDonations = donationHistory.length;

  // Show loading state
  if (!isMounted) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // Show wallet connection requirement
  if (!isConnected) {
    return <WalletRequired />;
  }

  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-4xl mx-auto px-6 sm:px-8 py-16 pb-24 md:pb-16'>
        <div className='space-y-12'>
          {/* Profile Header */}
          <ProfileHeader
            address={address}
            userBasename={userBasename}
            isInMiniApp={isInMiniApp}
            context={context}
          />

          {/* Stats Overview */}
          <StatsOverview
            totalDonatedAmount={totalDonatedAmount}
            totalDonations={totalDonations}
            earnedBadges={earnedBadges}
          />

          {/* SBT Badges */}
          <BadgeCard
            hasMintedBadge={Boolean(hasMintedBadge)}
            address={address}
            userBasename={userBasename}
          />

          {/* Donation Progress Chart */}
          <DonationProgressChart donationHistory={donationHistory} />

          {/* Donation History */}
          <DonationHistory
            donationHistory={donationHistory}
            isLoadingData={isLoadingData}
            onRefresh={fetchDonationHistory}
          />

          {/* Monthly Stats */}
          <MonthlyStats monthlyStats={monthlyStats} />

          {/* Call to Action */}
          <ProfileCallToAction />
        </div>
      </main>
    </div>
  );
}
