'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Clock } from 'lucide-react';

export function ApplicationHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='text-center mb-12'
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className='w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6'
      >
        <Heart className='w-10 h-10 text-white' />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='text-4xl md:text-5xl font-bold text-foreground mb-4'
      >
        Apply for Treatment Funding
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='text-muted-foreground text-lg max-w-3xl mx-auto mb-8'
      >
        We&apos;re here to help you access the cancer treatment you need. All
        applications are reviewed with care and compassion.
      </motion.p>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'
      >
        <div className='flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10'>
          <div className='w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center'>
            <Shield className='w-5 h-5 text-white' />
          </div>
          <div className='text-left'>
            <div className='text-sm font-semibold text-foreground'>
              Secure & Private
            </div>
            <div className='text-xs text-muted-foreground'>
              Your data is protected
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center'>
            <Clock className='w-5 h-5 text-white' />
          </div>
          <div className='text-left'>
            <div className='text-sm font-semibold text-foreground'>
              Quick Review
            </div>
            <div className='text-xs text-muted-foreground'>
              Response within 48 hours
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10'>
          <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
            <Heart className='w-5 h-5 text-white' />
          </div>
          <div className='text-left'>
            <div className='text-sm font-semibold text-foreground'>No Fees</div>
            <div className='text-xs text-muted-foreground'>
              100% of funds go to treatment
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
