'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { DollarSign, RefreshCw, Heart } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DonationCardProps {
  selectedAmount: number | null;
  customAmount: string;
  onAmountSelect: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onDonate: () => void;
  isTransactionPending: boolean;
  isConnected: boolean;
  isMounted: boolean;
  vaultSummary?: [bigint, bigint, bigint];
  vaultBalance?: bigint;
  isVaultBalanceLoading: boolean;
  isVaultSummaryLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  usdcBalance?: bigint;
  children?: ReactNode;
}

const donationAmounts = [25, 50, 100, 250, 500, 1000];

export function DonationCard({
  selectedAmount,
  customAmount,
  onAmountSelect,
  onCustomAmountChange,
  onDonate,
  isTransactionPending,
  isConnected,
  isMounted,
  vaultSummary,
  vaultBalance,
  isVaultBalanceLoading,
  isVaultSummaryLoading,
  isRefreshing,
  onRefresh,
  usdcBalance,
  children,
}: DonationCardProps) {
  const vaultAmount = vaultSummary ? vaultSummary[0] : vaultBalance; // Use totalRaised (index 0) instead of vaultBalance (index 2)
  const targetGoal = BigInt(5000000 * 1e6); // $5M goal
  const progressPercentage = vaultAmount
    ? Math.min((Number(vaultAmount) / Number(targetGoal)) * 100, 100)
    : 0;

  // Debug logging to see what data we're getting
  console.log('🔍 Progress Bar Debug:', {
    totalRaised: vaultSummary
      ? (Number(vaultSummary[0]) / 1e6).toFixed(2)
      : '0',
    progressPercentage: progressPercentage.toFixed(3),
    targetGoal: '5,000,000',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='w-full max-w-2xl mx-auto'
    >
      <Card className='bg-gradient-to-br from-blue-500/5 to-purple-600/5 border border-blue-500/20 rounded-2xl shadow-card p-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4'
          >
            <Heart className='w-8 h-8 text-white' />
          </motion.div>
          <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Make a Donation
          </h1>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Every dollar goes directly to funding cancer treatment costs through
            our secure Morpho vault.
          </p>
        </div>

        {/* Vault Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mb-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20'
        >
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                Live Vault Progress
              </h3>
              <p className='text-sm text-muted-foreground'>
                Help us reach our $5M goal
              </p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-foreground'>
                {isVaultBalanceLoading ||
                isVaultSummaryLoading ||
                isRefreshing ? (
                  <div className='flex items-center gap-2'>
                    <RefreshCw className='w-5 h-5 animate-spin text-muted-foreground' />
                    <span className='text-muted-foreground'>Loading...</span>
                  </div>
                ) : vaultAmount !== undefined ? (
                  `$${(Number(vaultAmount) / 1e6).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                ) : (
                  <span className='text-muted-foreground'>$0.00</span>
                )}
              </div>
              <p className='text-sm text-muted-foreground'>
                of $5,000,000 goal
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <Progress value={progressPercentage} className='h-3' />
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>
                {progressPercentage < 1
                  ? progressPercentage.toFixed(3)
                  : progressPercentage.toFixed(1)}
                % Complete
              </span>
              <span>
                $
                {vaultAmount
                  ? (Number(vaultAmount) / 1e6).toLocaleString()
                  : '0'}{' '}
                raised
              </span>
            </div>
          </div>

          <div className='flex justify-center mt-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={onRefresh}
              disabled={isRefreshing}
              className='text-muted-foreground hover:text-foreground'
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Donation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='space-y-6'
        >
          <div>
            <h2 className='text-xl font-semibold text-foreground mb-4'>
              Choose Amount
            </h2>

            {/* Quick Amount Buttons */}
            <div className='grid grid-cols-3 gap-3 mb-6'>
              {donationAmounts.map(amount => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAmountSelect(amount)}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200 font-semibold',
                    selectedAmount === amount
                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 ring-offset-2'
                      : 'border-white/20 hover:border-white/40 text-foreground hover:bg-white/5'
                  )}
                >
                  ${amount}
                </motion.button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-foreground'>
                Custom Amount (USDC)
              </label>
              <div className='relative'>
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                <Input
                  type='number'
                  value={selectedAmount || customAmount}
                  onChange={e => onCustomAmountChange(e.target.value)}
                  placeholder='Enter amount'
                  className='pl-10 bg-background/50 border-white/20 focus:border-primary focus:ring-2 focus:ring-primary/20'
                />
              </div>
            </div>
          </div>

          {/* User Balance Display */}
          {isMounted && isConnected && usdcBalance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20'
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                  Your USDC Balance:
                </span>
                <span className='text-lg font-semibold text-foreground'>
                  $
                  {(Number(usdcBalance) / 1e6).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </motion.div>
          )}

          {/* Donation Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {!isMounted ? (
              <div className='text-center p-6 bg-background/50 rounded-xl border border-white/20'>
                <p className='text-muted-foreground mb-4'>Loading...</p>
                <Button size='lg' className='w-full' disabled>
                  Loading...
                </Button>
              </div>
            ) : isConnected ? (
              <Button
                size='lg'
                className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
                onClick={onDonate}
                disabled={
                  isTransactionPending || (!selectedAmount && !customAmount)
                }
              >
                {isTransactionPending ? (
                  <div className='flex items-center gap-2'>
                    <RefreshCw className='w-5 h-5 animate-spin' />
                    Processing...
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Heart className='w-5 h-5' />
                    Donate USDC
                  </div>
                )}
              </Button>
            ) : (
              <div className='text-center p-6 bg-background/50 rounded-xl border border-black/20'>
                <p className='text-muted-foreground mb-4'>
                  Please connect your wallet to make a donation
                </p>
                <Button size='lg' className='w-full' disabled>
                  Connect Wallet to Donate
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Additional Content */}
        {children}
      </Card>
    </motion.div>
  );
}
