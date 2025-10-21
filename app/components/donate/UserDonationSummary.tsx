'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { User, DollarSign, TrendingUp } from 'lucide-react';

interface UserDonationSummaryProps {
  vaultSummary: [bigint, bigint, bigint];
  usdcBalance: bigint;
}

export function UserDonationSummary({
  vaultSummary,
  usdcBalance,
}: UserDonationSummaryProps) {
  const [totalRaised, userDonated] = vaultSummary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='w-full max-w-2xl mx-auto mb-6'
    >
      <Card className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
            <User className='w-5 h-5 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-foreground'>
            Your Donation Summary
          </h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <DollarSign className='w-4 h-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>
                Your USDC Balance
              </span>
            </div>
            <div className='text-lg font-semibold text-foreground'>
              $
              {(Number(usdcBalance) / 1e6).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <TrendingUp className='w-4 h-4 text-primary' />
              <span className='text-sm text-muted-foreground'>
                Your Total Donated
              </span>
            </div>
            <div className='text-lg font-semibold text-foreground'>
              $
              {(Number(userDonated) / 1e6).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <DollarSign className='w-4 h-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>
                Total Raised
              </span>
            </div>
            <div className='text-lg font-semibold text-foreground'>
              $
              {(Number(totalRaised) / 1e6).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
