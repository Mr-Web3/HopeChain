'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Lock, Eye, Zap } from 'lucide-react';

export function SecurityNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className='w-full max-w-2xl mx-auto'
    >
      <Card className='bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-green-500/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center'>
              <ShieldCheck className='w-6 h-6 text-white' />
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-semibold text-foreground mb-3'>
              Your Donation is Secure
            </h3>
            <p className='text-muted-foreground mb-4 leading-relaxed'>
              All funds are held in secure Morpho vaults and distributed
              directly to verified patients. You can track every transaction
              on-chain for complete transparency.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
              <div className='flex items-center gap-3'>
                <Lock className='w-5 h-5 text-green-500' />
                <span className='text-sm text-muted-foreground'>
                  Encrypted & Secure
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Eye className='w-5 h-5 text-blue-500' />
                <span className='text-sm text-muted-foreground'>
                  100% Transparent
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Zap className='w-5 h-5 text-purple-500' />
                <span className='text-sm text-muted-foreground'>
                  Instant Processing
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
