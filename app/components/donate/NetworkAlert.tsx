'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';

interface NetworkAlertProps {
  chainId: number;
  isConnected: boolean;
  isMounted: boolean;
}

export function NetworkAlert({
  chainId,
  isConnected,
  isMounted,
}: NetworkAlertProps) {
  const openUrl = useOpenUrl();

  if (!isMounted || !isConnected || chainId === 84532) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-2xl mx-auto mb-6'
    >
      <Card className='bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            <AlertTriangle className='w-6 h-6 text-yellow-500 mt-0.5' />
          </div>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-yellow-400 mb-2'>
              Wrong Network Detected
            </h3>
            <p className='text-yellow-300 mb-3'>
              Please switch to Base Sepolia network to make a donation.
            </p>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-yellow-300'>Required:</span>
                <span className='font-mono bg-yellow-500/20 px-2 py-1 rounded text-yellow-200'>
                  Base Sepolia (Chain ID: 84532)
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-yellow-300'>Current:</span>
                <span className='font-mono bg-red-500/20 px-2 py-1 rounded text-red-200'>
                  Chain ID: {chainId}
                </span>
              </div>
            </div>
            <div className='mt-4'>
              <button
                onClick={() =>
                  openUrl('https://docs.base.org/network-information')
                }
                className='inline-flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-200 transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
                How to add Base Sepolia to your wallet
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
