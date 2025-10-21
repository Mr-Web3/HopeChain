'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WalletRequired() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen bg-background flex items-center justify-center py-16'
    >
      <div className='text-center max-w-md mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='w-24 h-24 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8'
        >
          <User className='w-12 h-12 text-primary' />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-3xl font-bold text-foreground mb-4'
        >
          Wallet Required
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='text-muted-foreground mb-8 leading-relaxed'
        >
          Please connect your wallet to view your donation profile and history.
          Track your impact and manage your contributions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='flex flex-col sm:flex-row gap-4 justify-center'
        >
          <Button
            onClick={() => router.push('/donate')}
            className='bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
          >
            <Gift className='w-5 h-5 mr-2' />
            Donate Today
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
