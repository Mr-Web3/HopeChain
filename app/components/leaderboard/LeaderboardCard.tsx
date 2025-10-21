'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, ExternalLink } from 'lucide-react';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import Image from 'next/image';

interface DonorData {
  address: string;
  totalDonated: bigint;
  rank: number;
  metadata?: {
    name: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

interface LeaderboardCardProps {
  donor: DonorData;
  index: number;
}

export function LeaderboardCard({ donor, index }: LeaderboardCardProps) {
  const openUrl = useOpenUrl();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className='w-5 h-5 text-yellow-500' />;
      case 2:
        return <Medal className='w-5 h-5 text-gray-400' />;
      case 3:
        return <Award className='w-5 h-5 text-amber-600' />;
      default:
        return (
          <span className='text-lg font-bold text-muted-foreground'>
            #{rank}
          </span>
        );
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-500/50';
      default:
        return 'bg-gradient-to-br from-white/5 to-white/10 border-white/20';
    }
  };

  const getTierFromMetadata = () => {
    if (!donor.metadata?.attributes) return 'Supporter';

    const totalDonated = donor.metadata.attributes.find(
      attr => attr.trait_type === 'Total Donated (USDC)'
    )?.value;

    const amount = Number(totalDonated) || 0;

    if (amount >= 1000) return 'Diamond Champion';
    if (amount >= 350) return 'Gold Hero';
    return 'Silver Supporter';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Diamond Champion':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'Gold Hero':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'Silver Supporter':
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      default:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: bigint) => {
    return (Number(amount) / 1e6).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const tier = getTierFromMetadata();
  const tierColor = getTierColor(tier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card
        className={`${getRankGradient(donor.rank)} rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className='p-0'>
          <div className='flex items-center space-x-4'>
            {/* Rank */}
            <div className='flex-shrink-0'>{getRankIcon(donor.rank)}</div>

            {/* Badge Image */}
            <div className='flex-shrink-0'>
              {donor.metadata?.image ? (
                <Image
                  src={donor.metadata.image}
                  alt={`${donor.metadata.name || 'Donor'} badge`}
                  width={48}
                  height={48}
                  className='w-12 h-12 rounded-full object-cover border-2 border-white/20'
                />
              ) : (
                <div className='w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>
                    {donor.address.slice(2, 4).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Donor Info */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center space-x-2 mb-1'>
                <p className='font-medium text-sm truncate'>
                  {formatAddress(donor.address)}
                </p>
                <Badge variant='secondary' className={`text-xs ${tierColor}`}>
                  {tier}
                </Badge>
              </div>
              <p className='text-lg font-bold text-foreground'>
                ${formatAmount(donor.totalDonated)}
              </p>
            </div>

            {/* External Link */}
            <div className='flex-shrink-0'>
              <button
                onClick={() => openUrl(`/api/metadata/${donor.address}`)}
                className='text-muted-foreground hover:text-primary transition-colors'
                title='View NFT metadata'
              >
                <ExternalLink className='w-4 h-4' />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
