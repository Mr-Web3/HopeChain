'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useFrameContext } from './FrameProvider';
import { Copy, LogOut, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export function WalletAddress() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const frameContext = useFrameContext();
  const isInMiniApp = frameContext?.isInMiniApp ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll visibility - same as ProfilePopover
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop < 100); // Hide after scrolling 100px down
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  // Only show when connected AND in mini app
  if (!isConnected || !address || !isInMiniApp) {
    return null;
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!', {
        style: {
          background: '#121A33',
          color: '#E7EAF3',
          border: '1px solid #12B98F',
        },
      });
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to copy address:', err);
      toast.error('Failed to copy address', {
        style: {
          background: '#121A33',
          color: '#E7EAF3',
          border: '1px solid #ef4444',
        },
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed top-4 left-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      suppressHydrationWarning
    >
      <div className='relative'>
        {/* Wallet Address Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-all duration-200 shadow-sm'
        >
          <div className='w-2 h-2 bg-green-500 rounded-full'></div>
          <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 z-40'
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <div className='absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden'>
              <div className='p-2'>
                {/* Copy Address */}
                <button
                  onClick={copyAddress}
                  className='w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200'
                >
                  <Copy className='w-4 h-4' />
                  Copy Address
                </button>

                {/* Disconnect - Only show on desktop/web, not in mini apps */}
                {!isInMiniApp && (
                  <button
                    onClick={handleDisconnect}
                    className='w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200'
                  >
                    <LogOut className='w-4 h-4' />
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
