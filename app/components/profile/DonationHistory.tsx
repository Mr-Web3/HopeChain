'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw, ExternalLink } from 'lucide-react';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { useRouter } from 'next/navigation';

interface DonationHistoryItem {
  id: number;
  amount: number;
  date: string;
  txHash: string;
  blockNumber: number;
}

interface DonationHistoryProps {
  donationHistory: DonationHistoryItem[];
  isLoadingData: boolean;
  onRefresh: () => void;
}

export function DonationHistory({
  donationHistory,
  isLoadingData,
  onRefresh,
}: DonationHistoryProps) {
  const openUrl = useOpenUrl();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className='mb-12'
    >
      <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-black/20 rounded-2xl p-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground mb-2'>
              Recent Donations
            </h2>
            <p className='text-muted-foreground'>
              Your contribution history and impact
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={isLoadingData}
            className='border-white/20 text-foreground hover:bg-white/5'
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>

        {donationHistory.length > 0 ? (
          <div className='space-y-4'>
            {donationHistory.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className='group'
              >
                <div className='flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/5'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-4 mb-2'>
                      <span className='text-2xl font-bold text-foreground'>
                        $
                        {(donation.amount / 1e6).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className='px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'>
                        Completed
                      </span>
                    </div>
                    <div className='text-sm text-muted-foreground mb-1'>
                      Donation to HopeChain
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {new Date(donation.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                      openUrl(
                        `https://sepolia.basescan.org/tx/${donation.txHash}`
                      )
                    }
                    className='text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-200'
                  >
                    <ExternalLink className='w-4 h-4 mr-2' />
                    View on BaseScan
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className='text-center py-12'
          >
            <div className='w-20 h-20 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6'>
              <Heart className='w-10 h-10 text-primary' />
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-3'>
              No Donations Yet
            </h3>
            <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
              Make your first donation to start your HopeChain journey and help
              cancer patients access life-saving treatments.
            </p>
            <Button
              onClick={() => router.push('/donate')}
              className='bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
            >
              Make a Donation
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
