'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProfileCallToAction() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Card className='bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/60 rounded-2xl p-8 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300'>
        <div className='text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className='w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6'
          >
            <Heart className='w-8 h-8 text-white' />
          </motion.div>

          <h2 className='text-2xl font-semibold text-foreground mb-4'>
            Continue Making a Difference
          </h2>
          <p className='text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed'>
            Your donations are helping real people fight cancer. Every
            contribution matters and makes a tangible impact in someone&apos;s
            life.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button
              onClick={() => router.push('/donate')}
              size='lg'
              className='bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25'
            >
              Make Another Donation
              <ArrowRight className='w-5 h-5 ml-2' />
            </Button>

            <Button
              onClick={() => router.push('/impact')}
              variant='outline'
              size='lg'
              className='border-white/20 text-foreground hover:bg-white/5 px-8 py-4 rounded-xl'
            >
              View Impact
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
