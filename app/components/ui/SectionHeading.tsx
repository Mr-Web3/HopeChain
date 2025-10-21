'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionHeading({
  title,
  subtitle,
  description,
  icon,
  className,
  delay = 0,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-100px' }}
      className={cn('text-center mb-12', className)}
    >
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
          viewport={{ once: true }}
          className='flex justify-center mb-4'
        >
          <div className='w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center'>
            <span className='text-3xl text-white'>{icon}</span>
          </div>
        </motion.div>
      )}

      <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight'>
        {title}
      </h2>

      {subtitle && (
        <h3 className='text-xl md:text-2xl font-semibold text-foreground mb-4'>
          {subtitle}
        </h3>
      )}

      {description && (
        <p className='text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
          {description}
        </p>
      )}
    </motion.div>
  );
}
