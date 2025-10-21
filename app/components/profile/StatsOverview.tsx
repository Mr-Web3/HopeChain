'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { DollarSign, Heart, Trophy } from 'lucide-react';

interface StatsOverviewProps {
  totalDonatedAmount: number;
  totalDonations: number;
  earnedBadges: number;
}

export function StatsOverview({
  totalDonatedAmount,
  totalDonations,
  earnedBadges,
}: StatsOverviewProps) {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Donated',
      value: `$${totalDonatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: 'from-green-500 to-emerald-600',
      delay: 0.1,
    },
    {
      icon: Heart,
      label: 'Donations Made',
      value: totalDonations.toString(),
      gradient: 'from-pink-500 to-rose-600',
      delay: 0.2,
    },
    {
      icon: Trophy,
      label: 'Badges Earned',
      value: `${earnedBadges}/1`,
      gradient: 'from-yellow-500 to-orange-600',
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'
    >
      {stats.map(stat => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.delay }}
          whileHover={{ scale: 1.02, y: -2 }}
          className='group'
        >
          <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-black/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group-hover:border-white/80'>
            <div className='flex items-center gap-4 mb-4'>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <stat.icon className='w-6 h-6 text-white' />
              </div>
              <div>
                <div className='text-sm text-muted-foreground font-medium'>
                  {stat.label}
                </div>
                <div className='text-2xl font-bold text-foreground'>
                  {stat.value}
                </div>
              </div>
            </div>

            {/* Progress bar for badges */}
            {stat.label === 'Badges Earned' && (
              <div className='w-full bg-white/10 rounded-full h-2'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedBadges / 1) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className='bg-gradient-to-r from-yellow-500 to-orange-600 h-2 rounded-full'
                />
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
