'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Trophy, Star, Crown } from 'lucide-react';

interface DonationHistoryItem {
  id: number;
  amount: number;
  date: string;
  txHash: string;
  blockNumber: number;
}

interface DonationProgressChartProps {
  donationHistory: DonationHistoryItem[];
}

export function DonationProgressChart({
  donationHistory,
}: DonationProgressChartProps) {
  // Calculate cumulative donations
  const sortedDonations = donationHistory.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const cumulativeData = sortedDonations.reduce(
    (acc, donation, index) => {
      const previousTotal = index === 0 ? 0 : acc[index - 1]?.total || 0;
      acc.push({
        date: new Date(donation.date),
        amount: donation.amount,
        total: previousTotal + donation.amount,
        donation: donation,
      });
      return acc;
    },
    [] as Array<{
      date: Date;
      amount: number;
      total: number;
      donation: DonationHistoryItem;
    }>
  );

  const totalDonated =
    (cumulativeData[cumulativeData.length - 1]?.total || 0) / 1e6;

  // Define tier thresholds
  const tiers = [
    {
      threshold: 1,
      name: 'Supporter',
      color: 'bg-gray-300',
      icon: Star,
      min: 1,
      max: 349,
    },
    {
      threshold: 350,
      name: 'Hero',
      color: 'bg-yellow-400',
      icon: Trophy,
      min: 350,
      max: 999,
    },
    {
      threshold: 1000,
      name: 'Champion',
      color: 'bg-purple-500',
      icon: Crown,
      min: 1000,
      max: Infinity,
    },
  ];

  const getCurrentTier = () => {
    // Check tiers in order from highest to lowest
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (totalDonated >= tiers[i].min) {
        return tiers[i];
      }
    }
    // If no donations, return the first tier
    return tiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = tiers.findIndex(
      tier => tier.name === currentTier.name
    );
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNext = nextTier
    ? Math.min(
        ((totalDonated - currentTier.min) / (nextTier.min - currentTier.min)) *
          100,
        100
      )
    : 100;

  if (donationHistory.length === 0) {
    return (
      <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-black/20 rounded-2xl'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            <TrendingUp className='w-5 h-5' />
            <span>Your Lifetime Giving Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No donations yet</p>
            <p className='text-sm text-muted-foreground'>
              Make your first donation to start tracking your progress!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-black/20 rounded-2xl'>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <TrendingUp className='w-5 h-5' />
          <span>Your Lifetime Giving Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Current Status */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center space-x-2'>
            <currentTier.icon
              className={`w-6 h-6 ${currentTier.color.replace('bg-', 'text-')}`}
            />
            <Badge variant='secondary' className={currentTier.color}>
              {currentTier.name}
            </Badge>
          </div>
          <p className='text-2xl font-bold'>
            $
            {totalDonated.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className='text-sm text-muted-foreground'>Total Donated</p>
        </div>

        {/* Progress Bar */}
        {nextTier && (
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Progress to {nextTier.name}</span>
              <span>{progressToNext.toFixed(1)}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className={`h-2 rounded-full ${currentTier.color}`}
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>${currentTier.min}</span>
              <span>${nextTier.min}</span>
            </div>
          </div>
        )}

        {/* Tier Overview */}
        <div className='space-y-3'>
          <h4 className='font-medium text-sm'>Badge Tiers</h4>
          <div className='grid grid-cols-3 gap-2'>
            {tiers.map((tier, _index) => {
              const IconComponent = tier.icon;
              const isCurrentTier = tier.name === currentTier.name;
              const isAchieved = totalDonated >= tier.min;

              return (
                <div
                  key={tier.name}
                  className={`p-3 rounded-lg border text-center ${
                    isCurrentTier
                      ? 'border-primary bg-primary/5'
                      : isAchieved
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 mx-auto mb-1 ${
                      isCurrentTier
                        ? tier.color.replace('bg-', 'text-')
                        : isAchieved
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                  />
                  <p
                    className={`text-xs font-medium ${
                      isCurrentTier
                        ? 'text-primary'
                        : isAchieved
                          ? 'text-green-700'
                          : 'text-gray-500'
                    }`}
                  >
                    {tier.name}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    ${tier.min === Infinity ? '1000+' : tier.min}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donation Timeline - Commented out due to raw USDC values display */}
        {/* {cumulativeData.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Donation Timeline</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {cumulativeData.slice(-5).reverse().map((data, index) => (
                <div key={index} className="flex justify-between items-center text-xs py-1">
                  <span className="text-muted-foreground">
                    {data.date.toLocaleDateString()}
                  </span>
                  <span className="font-medium">
                    +${data.amount.toFixed(2)} (${data.total.toFixed(2)} total)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
