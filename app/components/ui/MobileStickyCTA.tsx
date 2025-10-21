'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileStickyCTAProps {
  primaryAction: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  className?: string;
}

export function MobileStickyCTA({
  primaryAction,
  secondaryAction,
  className,
}: MobileStickyCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden',
        'bg-background/95 backdrop-blur-md border-t border-border/50',
        'p-4 shadow-lg',
        className
      )}
    >
      <div className='flex gap-3 max-w-sm mx-auto'>
        <Button
          asChild
          size='lg'
          className='flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold rounded-xl'
        >
          <a
            href={primaryAction.href}
            className='flex items-center justify-center gap-2'
          >
            {primaryAction.icon && (
              <span className='text-lg'>{primaryAction.icon}</span>
            )}
            {primaryAction.label}
          </a>
        </Button>

        {secondaryAction && (
          <Button
            asChild
            variant='outline'
            size='lg'
            className='flex-1 bg-card/50 hover:bg-card/80 text-foreground border-white/20 hover:border-white/40 font-semibold rounded-xl'
          >
            <a
              href={secondaryAction.href}
              className='flex items-center justify-center gap-2'
            >
              {secondaryAction.icon && (
                <span className='text-lg'>{secondaryAction.icon}</span>
              )}
              {secondaryAction.label}
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
