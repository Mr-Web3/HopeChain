'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant='outline'
        size='icon'
        className='w-9 h-9'
        suppressHydrationWarning
      >
        <Sun className='h-4 w-4' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='w-9 h-9 bg-black/70 hover:bg-black/70 border border-white/70'
      suppressHydrationWarning
    >
      {theme === 'light' ? (
        <Moon className='h-4 w-4 fill-yellow-500 text-yellow-500' />
      ) : (
        <Sun className='h-4 w-4 fill-orange-500 text-orange-500' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
