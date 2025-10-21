'use client';

import { useFrameContext } from '../FrameProvider';
import { Header } from './Header';
import { MobileTabBar } from './MobileTabBar';
import ProfilePopover from '../ProfilePopover';
import { WalletAddress } from '../WalletStatus';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const frameContext = useFrameContext();
  const isInMiniApp = frameContext?.isInMiniApp ?? false;

  return (
    <div className='min-h-screen'>
      {/* Wallet Address - only show in mini app when connected */}
      <WalletAddress />

      {/* Header - show on desktop, hide on mobile */}
      <div className='hidden md:block'>
        <Header />
      </div>

      {/* Profile Popover - only show in mini app */}
      {isInMiniApp && <ProfilePopover />}

      {/* Main Content */}
      <main className='md:pb-0 pb-16'>{children}</main>

      {/* Mobile Tab Bar - only show on mobile */}
      <div className='md:hidden'>
        <MobileTabBar />
      </div>
    </div>
  );
}
