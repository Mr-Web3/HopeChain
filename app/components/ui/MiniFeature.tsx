'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Helper function to get gradient classes
function getGradientClass(from: string, to: string): string {
  const gradients: Record<string, string> = {
    'red-500-pink-600': 'bg-gradient-to-r from-red-500 to-pink-600',
    'blue-500-cyan-600': 'bg-gradient-to-r from-blue-500 to-cyan-600',
    'green-500-emerald-600': 'bg-gradient-to-r from-green-500 to-emerald-600',
    'purple-500-indigo-600': 'bg-gradient-to-r from-purple-500 to-indigo-600',
    'green-500-teal-600': 'bg-gradient-to-r from-green-500 to-teal-600',
  };

  const key = `${from}-${to}`;
  return gradients[key] || 'bg-gradient-to-r from-primary to-purple-600';
}

interface MiniFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
  delay?: number;
}

export function MiniFeature({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  className,
  delay = 0,
}: MiniFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: '-50px' }}
      className='text-center group'
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { duration: 0.2 },
        }}
        className='relative'
      >
        <div
          className={cn(
            'relative p-4 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10',
            'bg-gradient-to-br from-white/5 to-white/10 border border-white/10 group-hover:border-white/20',
            className
          )}
        >
          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300',
              'group-hover:shadow-lg group-hover:shadow-primary/20',
              getGradientClass(gradientFrom, gradientTo)
            )}
          >
            <span className='text-lg text-white group-hover:scale-110 transition-transform duration-200'>
              {icon}
            </span>
          </motion.div>

          {/* Content */}
          <h3 className='text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200'>
            {title}
          </h3>
          <p className='text-xs text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-200'>
            {description}
          </p>

          {/* Subtle gradient overlay on hover */}
          <div
            className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl',
              `bg-gradient-to-br from-${gradientFrom}/5 to-${gradientTo}/5`
            )}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
