'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Eye, Users } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className='mt-12'
    >
      <Card className='bg-gradient-to-r from-green-500/5 to-blue-500/5 border border-green-500/20 rounded-2xl p-8 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300'>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center'>
              <Shield className='w-6 h-6 text-white' />
            </div>
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-semibold text-foreground mb-3'>
              Your Privacy is Protected
            </h3>
            <p className='text-muted-foreground mb-6 leading-relaxed'>
              All medical information is encrypted and stored securely. We only
              share information with your treating physicians and never sell or
              share your data with third parties.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center gap-3'>
                <Lock className='w-5 h-5 text-green-500' />
                <span className='text-sm text-muted-foreground'>
                  End-to-End Encryption
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Eye className='w-5 h-5 text-blue-500' />
                <span className='text-sm text-muted-foreground'>
                  HIPAA Compliant
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Users className='w-5 h-5 text-purple-500' />
                <span className='text-sm text-muted-foreground'>
                  No Data Sharing
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
