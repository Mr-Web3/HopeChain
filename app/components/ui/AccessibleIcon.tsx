'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AccessibleIconProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

export function AccessibleIcon({
  icon,
  label,
  className,
}: AccessibleIconProps) {
  return (
    <span
      className={cn('inline-flex items-center justify-center', className)}
      role='img'
      aria-label={label}
    >
      {icon}
    </span>
  );
}
