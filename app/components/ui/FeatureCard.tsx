'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Helper function to get gradient classes
function getGradientClass(from: string, to: string): string {
  const gradients: Record<string, string> = {
    'blue-500-purple-600': 'bg-gradient-to-r from-blue-500 to-purple-600',
    'purple-500-pink-600': 'bg-gradient-to-r from-purple-500 to-pink-600',
    'pink-500-red-600': 'bg-gradient-to-r from-pink-500 to-red-600',
    'green-500-blue-600': 'bg-gradient-to-r from-green-500 to-blue-600',
  };

  const key = `${from}-${to}`;
  return gradients[key] || 'bg-gradient-to-r from-primary to-purple-600';
}

interface FeatureCardProps {
  step: number;
  title: string;
  description: string;
  icon: ReactNode;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
  delay?: number;
}

export function FeatureCard({
  step,
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  className,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: '-50px' }}
      className='text-center group'
    >
      <motion.div
        whileHover={{
          scale: 1.02,
          rotateY: 3,
          transition: { duration: 0.2 },
        }}
        className='relative'
      >
        <Card
          className={cn(
            'relative overflow-hidden bg-gradient-to-br p-4 md:p-6 shadow-md shadow-black/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10',
            'from-white/5 to-white/10 hover:border-white/20',
            'group-hover:from-white/10 group-hover:to-white/15',
            'h-full flex flex-col min-h-[200px] md:min-h-[220px]',
            className
          )}
        >
          {/* Step number */}
          <div className='absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full flex items-center justify-center text-sm font-bold text-primary'>
            {step}
          </div>

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-5 transition-all duration-300',
              'group-hover:shadow-lg group-hover:shadow-primary/20',
              getGradientClass(gradientFrom, gradientTo)
            )}
          >
            <span className='text-xl md:text-2xl text-white group-hover:scale-110 transition-transform duration-200'>
              {icon}
            </span>
          </motion.div>

          {/* Content */}
          <div className='flex flex-col flex-1'>
            <h3 className='text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors duration-200'>
              {title}
            </h3>
            <p className='text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-200 flex-1'>
              {description}
            </p>
          </div>

          {/* Subtle gradient overlay on hover */}
          <div
            className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
              `bg-gradient-to-br from-${gradientFrom}/5 to-${gradientTo}/5`
            )}
          />
        </Card>
      </motion.div>
    </motion.div>
  );
}
