'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Trophy, Star, Crown } from 'lucide-react';
import deployedContracts from '@/contracts/deployedContracts';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';

interface MetadataAttributes {
  trait_type: string;
  value: string | number;
}

interface DynamicMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: MetadataAttributes[];
}

interface DynamicBadgeProps {
  address: string;
}

export function DynamicBadge({ address }: DynamicBadgeProps) {
  const [metadata, setMetadata] = useState<DynamicMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const openUrl = useOpenUrl();

  const fetchMetadata = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/metadata/${address}`);

      if (response.status === 404) {
        setMetadata(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
      }

      const data = await response.json();
      setMetadata(data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchMetadata();
  }, [address, fetchMetadata]);

  const getTierInfo = (totalDonated: number) => {
    if (totalDonated >= 1000) {
      return {
        name: 'Diamond Champion',
        color:
          'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500',
        icon: Crown,
        frame:
          'ring-4 ring-purple-500/50 shadow-purple-500/25 dark:ring-purple-400/60 dark:shadow-purple-400/30',
      };
    } else if (totalDonated >= 350) {
      return {
        name: 'Gold Hero',
        color:
          'bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400',
        icon: Trophy,
        frame:
          'ring-4 ring-yellow-500/50 shadow-yellow-500/25 dark:ring-yellow-400/60 dark:shadow-yellow-400/30',
      };
    } else {
      return {
        name: 'Silver Supporter',
        color:
          'bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500',
        icon: Star,
        frame:
          'ring-4 ring-gray-500/50 shadow-gray-500/25 dark:ring-gray-400/60 dark:shadow-gray-400/30',
      };
    }
  };

  const getAttributeValue = (traitType: string) => {
    return metadata?.attributes.find(attr => attr.trait_type === traitType)
      ?.value;
  };

  const totalDonated = Number(getAttributeValue('Total Donated (USDC)')) || 0;
  const totalDonations = Number(getAttributeValue('Total Donations')) || 0;
  const lastDonation = getAttributeValue('Last Donation') as string;
  const tokenId = getAttributeValue('Token ID') as string;
  const tierInfo = getTierInfo(totalDonated);

  // Debug logging
  console.log('🔍 DynamicBadge Debug:', {
    metadata,
    totalDonated,
    totalDonations,
    lastDonation,
    tokenId,
    tierInfo: tierInfo.name,
    attributes: metadata?.attributes,
  });

  if (isLoading) {
    return (
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            <span className='ml-2 text-muted-foreground'>Loading badge...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='text-center text-red-500'>
            <p>Failed to load badge</p>
            <p className='text-sm text-muted-foreground'>{error}</p>
            <button
              onClick={fetchMetadata}
              className='mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90'
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metadata) {
    return (
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='text-center'>
            <p className='text-muted-foreground'>No donor badge found</p>
            <p className='text-sm text-muted-foreground'>
              Make a donation to receive your badge!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const IconComponent = tierInfo.icon;

  return (
    <Card className={`w-full ${tierInfo.frame} shadow-2xl`}>
      <CardContent className='p-6'>
        <div className='flex flex-col items-center space-y-4'>
          {/* Badge Image */}
          <div className='relative'>
            <Image
              src={metadata.image}
              alt={metadata.name}
              width={128}
              height={128}
              className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
            />
            <div
              className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${tierInfo.color} flex items-center justify-center`}
            >
              <IconComponent className='w-5 h-5 text-white' />
            </div>
          </div>

          {/* Badge Info */}
          <div className='text-center space-y-2'>
            <h3 className='text-xl font-bold'>{metadata.name}</h3>
            <Badge
              variant='secondary'
              className={`${tierInfo.color} text-white font-semibold`}
            >
              {tierInfo.name}
            </Badge>
            <p className='text-sm text-muted-foreground max-w-md'>
              {metadata.description}
            </p>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-4 w-full max-w-sm'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                ${totalDonated.toFixed(2)}
              </p>
              <p className='text-xs text-muted-foreground'>Total Donated</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {totalDonations}
              </p>
              <p className='text-xs text-muted-foreground'>Donations</p>
            </div>
          </div>

          {/* Last Donation */}
          {lastDonation && (
            <div className='text-center'>
              <p className='text-sm text-muted-foreground'>Last Donation</p>
              <p className='text-sm font-medium'>{lastDonation}</p>
            </div>
          )}

          {/* External Links */}
          <div className='flex space-x-4'>
            <button
              onClick={() => openUrl(metadata.external_url)}
              className='flex items-center space-x-2 text-sm text-primary hover:underline'
            >
              <ExternalLink className='w-4 h-4' />
              <span>View Impact</span>
            </button>
            {tokenId && tokenId !== 'undefined' && (
              <button
                onClick={() =>
                  openUrl(
                    `https://sepolia.basescan.org/nft/${deployedContracts[84532].DonationSBT.address}/${tokenId}`
                  )
                }
                className='flex items-center space-x-2 text-sm text-primary hover:underline'
              >
                <ExternalLink className='w-4 h-4' />
                <span>View on BaseScan</span>
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
