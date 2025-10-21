'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { DollarSign, Heart, TrendingUp } from 'lucide-react';

interface ImpactStatsProps {
  totalRaised: number;
  patientsHelped: number;
  successRate: number;
  totalCases: number;
  isLoading?: boolean;
}

export function ImpactStats({
  totalRaised,
  patientsHelped,
  successRate,
  totalCases,
  isLoading = false,
}: ImpactStatsProps) {
  const stats = [
    {
      icon: DollarSign,
      label: 'Total Raised',
      value: isLoading
        ? 'Loading...'
        : `$${totalRaised.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      gradient: 'from-green-500 to-emerald-600',
      delay: 0.1,
    },
    {
      icon: Heart,
      label: 'Patients Helped',
      value: isLoading ? 'Loading...' : patientsHelped.toString(),
      gradient: 'from-pink-500 to-rose-600',
      delay: 0.2,
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: isLoading ? 'Loading...' : `${successRate}%`,
      gradient: 'from-blue-500 to-cyan-600',
      delay: 0.3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='text-center mb-16'
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className='mb-8'
      >
        <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
          Our Impact
        </h1>
        <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
          See how your donations are making a real difference in patients&apos;
          lives
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
        {stats.map(stat => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.delay }}
            whileHover={{ scale: 1.05, y: -5 }}
            className='group'
          >
            <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10'>
              <div className='flex items-center gap-3 mb-4'>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className='w-6 h-6 text-white' />
                </motion.div>
                <span className='text-sm text-muted-foreground font-medium'>
                  {stat.label}
                </span>
              </div>
              <div className='text-3xl font-bold text-foreground mb-2'>
                {stat.value}
              </div>
              <div className='text-xs text-muted-foreground'>
                {stat.label === 'Success Rate' &&
                  (isLoading
                    ? 'Calculating...'
                    : `${patientsHelped} of ${totalCases} cases`)}
                {stat.label === 'Total Raised' &&
                  (isLoading ? 'Fetching data...' : 'Across all campaigns')}
                {stat.label === 'Patients Helped' &&
                  (isLoading ? 'Counting...' : 'Lives transformed')}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
