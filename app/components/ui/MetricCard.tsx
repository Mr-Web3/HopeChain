'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtext: string;
  gradientFrom: string;
  gradientTo: string;
  tooltip?: string;
  className?: string;
  delay?: number;
}

export function MetricCard({
  icon,
  title,
  value,
  subtext,
  gradientFrom,
  gradientTo,
  tooltip,
  className,
  delay = 0,
}: MetricCardProps) {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: 1.02,
        rotateY: 2,
        transition: { duration: 0.2 },
      }}
      className='group'
    >
      <Card
        className={cn(
          'relative overflow-hidden border-0 bg-gradient-to-br p-4 md:p-6 shadow-md shadow-black/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10',
          'from-white/5 to-white/10 border-white/10 hover:border-white/20',
          'w-full min-h-[120px] md:min-h-[140px]',
          className
        )}
      >
        <div className='flex items-center gap-3 mb-3'>
          <div className='text-xl md:text-2xl text-primary transition-transform duration-300 group-hover:scale-110'>
            {icon}
          </div>
          <span className='text-sm md:text-sm text-muted-foreground font-medium'>
            {title}
          </span>
        </div>

        <div className='text-xl md:text-2xl font-bold text-foreground mb-2'>{value}</div>

        <div className='text-xs md:text-sm text-muted-foreground'>{subtext}</div>

        {/* Subtle gradient overlay */}
        <div
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
            `bg-gradient-to-br from-${gradientFrom}/5 to-${gradientTo}/5`
          )}
        />
      </Card>
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}
