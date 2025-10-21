'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DonorData {
  address: string;
  amount: bigint;
  basename?: string;
}

interface DonorLeaderboardProps {
  donorData: DonorData[];
  donorCount?: bigint;
  isLoadingDonorData: boolean;
  onRefresh: () => void;
  allDonors?: string[];
}

export function DonorLeaderboard({
  donorData,
  donorCount,
  isLoadingDonorData,
  onRefresh,
  allDonors,
}: DonorLeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className='w-4 h-4 text-yellow-500' />;
      case 1:
        return <Medal className='w-4 h-4 text-gray-400' />;
      case 2:
        return <Award className='w-4 h-4 text-amber-600' />;
      default:
        return (
          <div className='w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center'>
            <span className='text-xs font-bold text-primary'>{index + 1}</span>
          </div>
        );
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-yellow-600/5';
      case 1:
        return 'border-gray-400/30 bg-gradient-to-r from-gray-400/5 to-gray-500/5';
      case 2:
        return 'border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-amber-600/5';
      default:
        return 'border-white/10 hover:border-white/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className='w-full max-w-2xl mx-auto'
    >
      <Card className='bg-background/50 border border-white/10 overflow-hidden rounded-2xl'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Trophy className='w-6 h-6 text-primary' />
              <h3 className='text-xl font-semibold text-foreground'>
                Top Donors
              </h3>
            </div>
            <div className='flex items-center gap-3'>
              {donorCount !== undefined && (
                <Badge
                  variant='outline'
                  className='border-primary/20 text-primary'
                >
                  {Number(donorCount)}{' '}
                  {Number(donorCount) === 1 ? 'donor' : 'donors'}
                </Badge>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={onRefresh}
                disabled={isLoadingDonorData}
                className='text-muted-foreground hover:text-foreground'
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoadingDonorData ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {isLoadingDonorData ? (
            <div className='flex items-center justify-center py-12'>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <RefreshCw className='w-5 h-5 animate-spin' />
                <span>Loading donor data...</span>
              </div>
            </div>
          ) : donorData.length > 0 ? (
            <div className='space-y-4'>
              <p className='text-sm text-muted-foreground text-center mb-6'>
                Thank you to our generous donors who are making a difference:
              </p>

              <div className='space-y-3 max-h-80 overflow-y-auto'>
                {donorData.map((donor, index) => (
                  <motion.div
                    key={donor.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border transition-all duration-200',
                      getRankStyle(index)
                    )}
                  >
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center justify-center w-8 h-8'>
                        {getRankIcon(index)}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm font-semibold text-foreground'>
                          {donor.basename ||
                            `${donor.address.slice(0, 6)}...${donor.address.slice(-4)}`}
                        </span>
                        {donor.basename && (
                          <span className='text-xs text-muted-foreground font-mono'>
                            {donor.address.slice(0, 6)}...
                            {donor.address.slice(-4)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <span className='text-lg font-bold text-foreground'>
                        $
                        {(Number(donor.amount) / 1e6).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : allDonors && allDonors.length > 0 ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <p className='text-sm text-muted-foreground mb-2'>
                  Loading donor details...
                </p>
                <RefreshCw className='w-5 h-5 animate-spin mx-auto text-muted-foreground' />
              </div>
            </div>
          ) : (
            <div className='text-center py-12'>
              <Trophy className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground mb-2'>No donors yet</p>
              <p className='text-sm text-muted-foreground'>
                Be the first to make a donation and help fund cancer treatment
                costs.
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
