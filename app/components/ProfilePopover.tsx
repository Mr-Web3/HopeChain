/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useFrameContext } from './FrameProvider';
import { fetchNeynarUserProfile, NeynarUserProfile } from '../../utils/neynar';
import Image from 'next/image';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { ThemeToggle } from './ui/ThemeToggle';
import { useAccount } from 'wagmi';
import { Name } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePopover() {
  const frameContext = useFrameContext();
  const user = (frameContext?.context as any)?.user;
  const insets = (frameContext?.context as any)?.client?.safeAreaInsets || {};
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [neynarProfile, setNeynarProfile] = useState<NeynarUserProfile | null>(
    null
  );
  const [loadingProfile, setLoadingProfile] = useState(false);
  const openUrl = useOpenUrl();
  const { address, isConnected } = useAccount();

  // Debug logging
  useEffect(() => {
    console.log('ProfilePopover - frameContext:', frameContext);
    console.log('ProfilePopover - user:', user);
    console.log('ProfilePopover - isInMiniApp:', frameContext?.isInMiniApp);
    console.log('ProfilePopover - user.pfpUrl:', user?.pfpUrl);
  }, [frameContext, user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop < 100); // Hide after scrolling 100px down
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Neynar profile data when user is available and in mini app
  useEffect(() => {
    const fetchProfile = async () => {
      // Only fetch Neynar data when in mini app
      if (
        frameContext?.isInMiniApp &&
        user?.fid &&
        !neynarProfile &&
        !loadingProfile
      ) {
        setLoadingProfile(true);
        try {
          const profile = await fetchNeynarUserProfile(user.fid);
          if (profile) {
            setNeynarProfile(profile);
          }
        } catch (error) {
          console.error('Failed to fetch Neynar profile:', error);
          // Continue without Neynar data - app will work with Farcaster data only
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();
  }, [frameContext?.isInMiniApp, user?.fid, neynarProfile, loadingProfile]);

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest?.('[data-profile-popover]') &&
        !target.closest?.('[data-profile-trigger]')
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, []);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!', {
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--accent))',
        },
      });
    } catch (err) {
      console.error('Failed to copy address:', err);
      toast.error('Failed to copy address', {
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--destructive))',
        },
      });
    }
  };

  if (!mounted) return null;

  // Show fallback if no user data yet
  if (!user) {
    console.log('ProfilePopover - no user data, showing fallback');
    return (
      <div
        className='fixed z-50'
        style={{
          top: 12,
          right: 12,
        }}
      >
        <div className='h-8 w-8 rounded-full bg-muted animate-pulse' />
      </div>
    );
  }

  return (
    <div
      className={`fixed z-[100] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        top: (insets.top ?? 0) + 12,
        right: (insets.right ?? 0) + 12,
      }}
    >
      <button
        type='button'
        data-profile-trigger
        onClick={e => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        className='flex-shrink-0'
        aria-label='Open profile'
      >
        {user.pfpUrl ? (
          <Image
            src={user.pfpUrl}
            alt='Profile'
            className='h-10 w-10 rounded-md object-cover'
            width={40}
            height={40}
          />
        ) : (
          <div className='h-10 w-10 rounded-xl bg-muted' />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black bg-opacity-50'
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet */}
          <div
            data-profile-popover
            className='fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-xl shadow-2xl'
            style={{
              zIndex: 9999,
              paddingBottom: (insets.bottom ?? 0) + 20,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className='p-6'>
              {/* Header with Profile Photo and Theme Toggle */}
              <div className='flex items-start justify-between mb-8'>
                {/* Profile Photo */}
                <div className='flex-shrink-0'>
                  {user.pfpUrl ? (
                    <Image
                      src={user.pfpUrl}
                      alt='Profile'
                      className='h-20 w-20 rounded-xl object-cover shadow-md border-2 border-border'
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className='h-20 w-20 rounded-xl bg-muted shadow-md border-2 border-border' />
                  )}
                </div>

                {/* Theme Toggle - Top Right */}
                <div className='flex items-center pt-1'>
                  <ThemeToggle />
                </div>
              </div>

              {/* User Info Section */}
              <div className='mb-6'>
                <h2 className='text-2xl font-bold text-foreground mb-2'>
                  {neynarProfile?.display_name ||
                    user.displayName ||
                    user.username ||
                    `FID ${user.fid}`}
                </h2>
                {(user.username || user.fid) && (
                  <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
                    {user.username && (
                      <span className='font-medium'>@{user.username}</span>
                    )}
                    {user.username && user.fid && (
                      <span className='text-muted-foreground/50'>·</span>
                    )}
                    {user.fid && (
                      <span className='text-xs bg-muted px-2 py-0.5 rounded-full font-medium'>
                        FID {user.fid}
                      </span>
                    )}
                  </div>
                )}
                {/* Location */}
                {(user.location?.description ||
                  neynarProfile?.location?.description) && (
                  <div className='flex items-center gap-1.5 text-sm text-muted-foreground mb-4'>
                    <span>📍</span>
                    <span>
                      {user.location?.description ||
                        neynarProfile?.location?.description}
                    </span>
                  </div>
                )}

                {/* Wallet Address Section - Only show if connected */}
                {isConnected && address && (
                  <div className='bg-muted/20 rounded-xl p-3 border border-border/30 flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                      <div className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0'></div>
                      <div className='flex-1 min-w-0'>
                        <Name
                          address={address as `0x${string}`}
                          chain={base}
                          onError={error =>
                            console.log('Name component error:', error)
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={copyAddress}
                      className='flex-shrink-0 p-2 hover:bg-muted/50 rounded-lg transition-colors active:scale-95'
                      aria-label='Copy address'
                    >
                      <Copy className='h-4 w-4 text-muted-foreground' />
                    </button>
                  </div>
                )}
              </div>

              {/* Stats Section */}
              {neynarProfile &&
                (neynarProfile.following_count ||
                  neynarProfile.follower_count) && (
                  <div className='bg-muted/30 rounded-xl p-5 mb-6 border border-border/50'>
                    <div className='flex justify-around'>
                      <div className='flex flex-col items-center'>
                        <div className='text-2xl font-bold text-foreground mb-1'>
                          {neynarProfile.following_count?.toLocaleString() ||
                            '0'}
                        </div>
                        <div className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                          Following
                        </div>
                      </div>
                      <div className='w-px bg-border' />
                      <div className='flex flex-col items-center'>
                        <div className='text-2xl font-bold text-foreground mb-1'>
                          {neynarProfile.follower_count?.toLocaleString() ||
                            '0'}
                        </div>
                        <div className='text-xs font-medium text-muted-foreground uppercase tracking-wide'>
                          Followers
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Bio Section */}
              {(neynarProfile?.profile?.bio?.text || user.bio) && (
                <div className='bg-muted/20 rounded-xl p-4 mb-6 border border-border/30'>
                  <p className='text-sm text-foreground leading-relaxed'>
                    {neynarProfile?.profile?.bio?.text || user.bio}
                  </p>
                </div>
              )}

              {/* Social Links */}
              {neynarProfile?.social_verifications &&
                (neynarProfile.social_verifications.twitter ||
                  neynarProfile.social_verifications.github) && (
                  <div className='space-y-2'>
                    {neynarProfile.social_verifications.twitter && (
                      <button
                        onClick={() =>
                          openUrl(
                            `https://twitter.com/${neynarProfile.social_verifications.twitter}`
                          )
                        }
                        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-xl transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40 active:scale-[0.98]'
                      >
                        <span className='text-base'>🐦</span>
                        <span className='text-sm font-medium'>
                          @{neynarProfile.social_verifications.twitter}
                        </span>
                      </button>
                    )}
                    {neynarProfile.social_verifications.github && (
                      <button
                        onClick={() =>
                          openUrl(
                            `https://github.com/${neynarProfile.social_verifications.github}`
                          )
                        }
                        className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl transition-all duration-200 border border-border hover:border-border/80 active:scale-[0.98]'
                      >
                        <span className='text-base'>🐙</span>
                        <span className='text-sm font-medium'>
                          @{neynarProfile.social_verifications.github}
                        </span>
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
