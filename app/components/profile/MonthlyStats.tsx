'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

interface MonthlyStat {
  month: string;
  amount: number;
  donations: number;
}

interface MonthlyStatsProps {
  monthlyStats: MonthlyStat[];
}

export function MonthlyStats({ monthlyStats }: MonthlyStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className='mb-12'
    >
      <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-black/20 rounded-2xl p-8'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-semibold text-foreground mb-2'>
            Monthly Breakdown
          </h2>
          <p className='text-muted-foreground'>
            Track your giving patterns over time
          </p>
        </div>

        {monthlyStats.length > 0 ? (
          <div className='space-y-4'>
            {monthlyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className='group'
              >
                <div className='flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                      <TrendingUp className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <div className='font-semibold text-foreground text-lg'>
                        {stat.month}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {stat.donations} donation
                        {stat.donations !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-2xl font-bold text-foreground'>
                      $
                      {(stat.amount / 1e6).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className='text-sm text-muted-foreground'>total</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className='text-center py-12'
          >
            <div className='w-16 h-16 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <DollarSign className='w-8 h-8 text-primary' />
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              No Monthly Data Yet
            </h3>
            <p className='text-muted-foreground'>
              Start making donations to see your monthly breakdown
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
