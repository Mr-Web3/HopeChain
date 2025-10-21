'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PersonalStoryProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function PersonalStory({
  title,
  subtitle,
  icon,
  children,
  className,
  delay = 0,
}: PersonalStoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={cn('mb-12', className)}
    >
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
              viewport={{ once: true }}
              className='flex justify-center mb-6'
            >
              <div className='w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center'>
                <span className='text-2xl text-primary-foreground'>{icon}</span>
              </div>
            </motion.div>
          )}

          <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            {title}
          </h2>

          <h3 className='text-xl md:text-2xl font-semibold text-primary mb-6'>
            {subtitle}
          </h3>
        </div>

        {/* Story Content with Image and Scrollable Text */}
        <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-md shadow-black/20'>
          {/* Scrollable Content Container */}
          <div className='max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-primary/10 hover:scrollbar-thumb-primary/80 transition-all duration-300 pr-4 relative'>
            <div className='space-y-6 text-base md:text-lg leading-relaxed'>
              {children}
            </div>

            {/* Fade effect at bottom */}
            <div className='sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent pointer-events-none' />
          </div>

          {/* Scroll indicator */}
          <div className='absolute top-4 right-4 flex flex-col items-center space-y-2 text-primary/60 text-xs font-medium'>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className='flex flex-col items-center space-y-1'
            >
              <div className='w-1 h-6 bg-gradient-to-b from-primary/60 to-transparent rounded-full'></div>
              <span>Scroll</span>
            </motion.div>
          </div>

          {/* Subtle gradient overlay */}
          <div className='absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-primary/5 to-primary/10' />
        </div>
      </div>
    </motion.div>
  );
}
