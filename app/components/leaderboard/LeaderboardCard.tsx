'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, ExternalLink } from 'lucide-react';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';

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
        className={`${getRankGradient(donor.rank)} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className='p-0'>
          <div className='flex flex-col items-center text-center space-y-3'>
            {/* Rank */}
            <div className='flex items-center justify-center'>
              {getRankIcon(donor.rank)}
            </div>

            {/* Donation Amount */}
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground mb-2'>
                ${formatAmount(donor.totalDonated)}
              </p>
              <Badge
                variant='secondary'
                className={`text-xs px-2 py-1 ${tierColor}`}
              >
                {tier}
              </Badge>
            </div>

            {/* External Link */}
            <button
              onClick={() => openUrl(`/api/metadata/${donor.address}`)}
              className='text-muted-foreground hover:text-primary transition-colors p-1'
              title='View NFT metadata'
            >
              <ExternalLink className='w-4 h-4' />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
