'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { DynamicBadge } from './DynamicBadge';
import { DonationProofButton } from './DonationProofButton';

interface BadgeCardProps {
  hasMintedBadge: boolean;
  address?: string;
  userBasename?: string;
}

export function BadgeCard({
  hasMintedBadge,
  address,
  userBasename,
}: BadgeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className='mb-12'
    >
      <Card className='bg-gradient-to-br from-white/5 to-white/10 border border-black/20 rounded-2xl p-8'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-semibold text-foreground mb-2'>
            Your Dynamic SBT Badge
          </h2>
          <p className='text-muted-foreground'>
            Live updating badge that reflects your donation history
          </p>
        </div>

        <div className='flex flex-col items-center space-y-6'>
          {/* Dynamic Badge */}
          {address && <DynamicBadge address={address} />}

          {/* Donation Proof Button */}
          {address && hasMintedBadge && (
            <DonationProofButton
              address={address}
              userBasename={userBasename}
            />
          )}

          {/* Fallback for no badge */}
          {!hasMintedBadge && (
            <div className='text-center py-8'>
              <p className='text-muted-foreground mb-2'>No badge yet</p>
              <p className='text-sm text-muted-foreground'>
                Make a donation to receive your dynamic SBT badge!
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
