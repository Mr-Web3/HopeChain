'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  username?: string;
  primaryAction: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  secondaryAction: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  badge?: {
    text: string;
    icon?: ReactNode;
  };
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  logo,
  username,
  primaryAction,
  secondaryAction,
  badge,
  className,
}: HeroSectionProps) {
  return (
    <div className={cn('text-center mb-16', className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='mb-8'
      >
        {/* Welcome Message with Username */}
        {username && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-center mb-6'
          >
            <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
              Welcome to <span className='gradient-text'>HopeChain</span>,{' '}
              <span className='text-blue-500'>@{username}</span>
            </h2>
          </motion.div>
        )}

        {/* Logo */}
        {logo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='flex justify-center mb-6'
          >
            <div className='relative'>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className='h-32 w-32 md:h-40 md:w-40 rounded-2xl object-cover animate-float'
                priority
              />
              {/* Subtle glow effect */}
              <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl -z-10 scale-110' />
            </div>
          </motion.div>
        )}

        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='mb-6'
        >
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight'>
            {title}
          </h1>
          <p className='text-xl md:text-2xl font-semibold text-foreground mb-4'>
            {subtitle}
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed'
        >
          {description}
        </motion.p>

        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className='inline-flex items-center gap-2 px-4 py-2 bg-none border border-primary/20 rounded-full text-sm font-medium text-primary mb-6'
          >
            {badge.icon && (
              <span className='w-2 h-2 bg-primary rounded-full animate-pulse' />
            )}
            {badge.text}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className='flex flex-col sm:flex-row gap-4 justify-center'
        >
          <Button
            asChild
            size='lg'
            className='group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1'
          >
            <a href={primaryAction.href} className='flex items-center gap-3'>
              {primaryAction.icon && (
                <span className='text-xl group-hover:scale-110 transition-transform duration-200'>
                  {primaryAction.icon}
                </span>
              )}
              {primaryAction.label}
            </a>
          </Button>

          <Button
            asChild
            variant='outline'
            size='lg'
            className='group bg-background/50 hover:bg-background/80 text-foreground hover:text-foreground border-border hover:border-primary/50 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1'
          >
            <a href={secondaryAction.href} className='flex items-center gap-3'>
              {secondaryAction.icon && (
                <span className='text-xl group-hover:scale-110 transition-transform duration-200'>
                  {secondaryAction.icon}
                </span>
              )}
              {secondaryAction.label}
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
