'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';

export function CallToAction() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className='mt-16'
    >
      <Card className='bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/20 rounded-2xl p-8 md:p-12 text-center hover:shadow-lg hover:shadow-primary/10 transition-all duration-300'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className='w-20 h-20 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6'
        >
          <Heart className='w-10 h-10 text-white' />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='text-3xl md:text-4xl font-bold text-foreground mb-4'
        >
          Help Fund More Treatments
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className='text-muted-foreground text-lg mb-8 max-w-2xl mx-auto leading-relaxed'
        >
          Your donation could be the difference between life and death for
          someone fighting cancer. Every dollar goes directly to patients with
          zero administrative fees.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center'
        >
          <Button
            size='lg'
            className='bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold rounded-xl px-8 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
            asChild
          >
            <a href='/donate' className='flex items-center gap-2'>
              <Heart className='w-5 h-5' />
              Donate Now
              <ArrowRight className='w-4 h-4' />
            </a>
          </Button>

          <Button
            variant='outline'
            size='lg'
            className='border-white/20 text-foreground hover:bg-white/5 rounded-xl px-8 py-4 transition-all duration-300'
            asChild
          >
            <a href='/apply' className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4' />
              Apply for Funding
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className='mt-8 pt-6 border-t border-white/10'
        >
          <div className='flex items-center justify-center gap-6 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span>100% Transparent</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              <span>Zero Fees</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span>On-Chain</span>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
