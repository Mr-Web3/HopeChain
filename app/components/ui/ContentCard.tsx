'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: ReactNode;
  gradientFrom: string;
  gradientTo: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
}

export function ContentCard({
  title,
  subtitle,
  description,
  icon,
  gradientFrom,
  gradientTo,
  children,
  className,
  delay = 0,
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className='mb-12'
    >
      <Card
        className={cn(
          'relative overflow-hidden border-0 bg-gradient-to-r shadow-md shadow-black/20 p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10',
          'from-white/5 to-white/10 border-white/20 hover:border-white/30',
          className
        )}
      >
        {/* Header */}
        <div className='text-center mb-6'>
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
              viewport={{ once: true }}
              className='flex justify-center mb-4'
            >
              <div className='w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center'>
                <span className='text-2xl text-white'>{icon}</span>
              </div>
            </motion.div>
          )}

          <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-4'>
            {title}
          </h2>

          {subtitle && (
            <h3 className='text-lg md:text-xl font-semibold text-foreground mb-4'>
              {subtitle}
            </h3>
          )}
        </div>

        {/* Content */}
        <div className='max-w-3xl mx-auto'>
          <p className='text-base md:text-lg text-muted-foreground mb-4 leading-relaxed'>
            {description}
          </p>

          {children && <div className='mt-6'>{children}</div>}
        </div>

        {/* Subtle gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none',
            `bg-gradient-to-br from-${gradientFrom}/5 to-${gradientTo}/5`
          )}
        />
      </Card>
    </motion.div>
  );
}
