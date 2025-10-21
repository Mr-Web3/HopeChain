'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Users, FileText, User } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Donate', href: '/donate', icon: DollarSign },
  { name: 'Impact', href: '/impact', icon: Users },
  { name: 'Apply', href: '/apply', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md z-50'>
      <div className='flex items-center justify-around h-16 px-2'>
        {navigation.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground hover:text-primary hover:bg-muted/50'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-foreground'}`}
              />
              <span className='text-xs font-medium'>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
