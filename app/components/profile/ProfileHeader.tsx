'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { Heart, User } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  address?: string | undefined;
  userBasename?: string | undefined;
  isInMiniApp: boolean;
  context: any;
}

export function ProfileHeader({
  address: _address,
  userBasename: _userBasename,
  isInMiniApp,
  context,
}: ProfileHeaderProps) {
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
        className='w-24 h-24 bg-gradient-to-r from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25'
      >
        <Heart className='w-12 h-12 text-white' />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='text-4xl md:text-5xl font-bold text-foreground mb-4'
      >
        Your Profile
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='text-muted-foreground text-lg max-w-2xl mx-auto mb-8'
      >
        Track your impact and manage your donations
      </motion.p>

      {/* Address Display - temporarily removed due to TypeScript issues */}

      {/* Farcaster User Info */}
      {isInMiniApp &&
        context &&
        typeof context === 'object' &&
        'user' in context && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='max-w-md mx-auto'
          >
            <div className='bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-6'>
              <div className='flex items-center gap-4'>
                {/* Profile Image */}
                <div className='flex-shrink-0'>
                  {(context as any).user.pfpUrl ? (
                    <Image
                      src={(context as any).user.pfpUrl}
                      alt='Profile'
                      className='w-16 h-16 rounded-xl object-cover border-2 border-white/20'
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className='w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center'>
                      <User className='w-8 h-8 text-white' />
                    </div>
                  )}
                </div>

                {/* User Details */}
                <div className='flex-1 text-left'>
                  <h2 className='text-lg font-semibold text-foreground mb-1'>
                    @
                    {(context as any).user.username ||
                      `FID ${(context as any).user.fid}`}
                  </h2>
                  <p className='text-muted-foreground text-sm mb-2'>
                    {(context as any).user.displayName || 'Farcaster User'}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <span>FID: {(context as any).user.fid}</span>
                    <div className='inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 rounded-full'>
                      <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>
                      Connected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
    </motion.div>
  );
}
