'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Users, FileText, User } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Name } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Donate', href: '/donate', icon: DollarSign },
  { name: 'Impact', href: '/impact', icon: Users },
  { name: 'Apply', href: '/apply', icon: FileText },
  { name: 'Profile', href: '/profile', icon: User },
];

// Custom ConnectButton component that shows basenames
function CustomConnectButton() {

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type='button'
                    className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type='button'
                    className='px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors'
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  type='button'
                  className='px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2'
                >
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <span>
                    <Name 
                      address={account.address as `0x${string}`} 
                      chain={base}
                      onError={() => account.displayName}
                    />
                  </span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

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
              <div className='rounded-xl flex items-center justify-center'>
                <Image src='/logos/hopeLogo3.png' 
                  alt='HopeChain Logo' 
                  width={100} 
                  height={100} 
                  className='w-28 h-28 object-contain' 
                />
              </div>
              {/* <span className='ml-0 mt-2 text-lg font-bold text-foreground leading-none'>
                Chain
              </span> */}
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

          {/* Theme Toggle & Connect Wallet Button */}
          <div className='flex items-center gap-3'>
            <ThemeToggle />
            <CustomConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
