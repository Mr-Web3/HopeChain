'use client';

import { useState, useEffect } from 'react';
import { useFrameContext } from '../FrameProvider';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';
import ProfilePopover from '../ProfilePopover';
import { WalletAddress } from '../WalletStatus';
import { DesktopProviders } from '../providers/DesktopProviders';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const frameContext = useFrameContext();

  // Determine platform type
  const isInMiniApp = frameContext?.isInMiniApp ?? false;

  // Check if we're on a mobile device using multiple methods
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobileDevice = () => {
      // Method 1: User agent detection
      const userAgent = navigator.userAgent;
      const isMobileUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );

      // Method 2: Screen width detection (more reliable for dev tools)
      const isMobileScreen = window.innerWidth <= 768;

      // Method 3: Touch capability detection
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Combine all methods - if any suggest mobile, consider it mobile
      const isMobile = isMobileUA || isMobileScreen || isTouchDevice;

      setIsMobileDevice(isMobile);
    };

    checkMobileDevice();

    // Also check on resize
    const handleResize = () => {
      checkMobileDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show mobile layout if:
  // 1. We're in a mini app (Farcaster mobile), OR
  // 2. We're on a mobile device (even outside mini app)
  const showMobileLayout = isInMiniApp || isMobileDevice;
  const showWebLayout = !showMobileLayout;

  return (
    <div className='min-h-screen'>
      {/* Wallet Address - only show in mini app when connected */}
      <WalletAddress />

      {/* Web Header - only show on web platform with RainbowKit providers */}
      {showWebLayout ? (
        <DesktopProviders>
          <Header />
        </DesktopProviders>
      ) : null}

      {/* Profile Popover - only show in mini app */}
      {frameContext?.isInMiniApp && <ProfilePopover />}

      {/* Main Content */}
      <main className={showMobileLayout ? 'pb-16' : ''}>{children}</main>

      {/* Mobile Tab Bar - only show on mobile platform */}
      {showMobileLayout && <MobileTabBar />}
    </div>
  );
}
