'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Users, FileText, User, Heart } from 'lucide-react';
import { WalletConnect } from '../wallet/WalletConnect';
import { DesktopWalletConnect } from '../wallet/DesktopWalletConnect';
import { ThemeToggle } from '../ui/ThemeToggle';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Donate', href: '/donate', icon: DollarSign },
  { name: 'Impact', href: '/impact', icon: Users },
  { name: 'Apply', href: '/apply', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border'>
      <div className='max-w-7xl mx-auto px-6 sm:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link
              href='/'
              className='flex items-center hover:opacity-80 transition-opacity'
            >
              <div className='w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25'>
                <Heart className='w-5 h-5 text-white' />
              </div>
              <span className='ml-3 text-xl font-bold text-foreground'>
                HopeChain
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-1'>
            {navigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  <item.icon className='w-4 h-4' />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle & Connect Wallet Button - Desktop */}
          <div className='hidden md:flex items-center gap-3'>
            <ThemeToggle />
            <DesktopWalletConnect />
          </div>

          {/* Theme Toggle & Connect Wallet Button - Mobile */}
          <div className='md:hidden flex items-center gap-2'>
            <ThemeToggle />
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}
