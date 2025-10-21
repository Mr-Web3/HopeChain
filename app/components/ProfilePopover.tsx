/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useFrameContext } from './FrameProvider';
import { fetchNeynarUserProfile, NeynarUserProfile } from '../../utils/neynar';
import Image from 'next/image';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { ThemeToggle } from './ui/ThemeToggle';

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
              <div className='flex items-start justify-between mb-6'>
                {/* Profile Photo */}
                <div className='flex flex-col items-center'>
                  {user.pfpUrl ? (
                    <Image
                      src={user.pfpUrl}
                      alt='Profile'
                      className='h-16 w-16 rounded-md object-cover shadow-lg'
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className='h-16 w-16 rounded-md bg-muted shadow-lg' />
                  )}
                </div>

                {/* Theme Toggle - Top Right */}
                <div className='flex items-center'>
                  <ThemeToggle />
                </div>
              </div>

              {/* User Info Section */}
              <div className='text-center mb-6'>
                <div className='text-foreground font-semibold text-xl mb-1'>
                  {neynarProfile?.display_name ||
                    user.displayName ||
                    user.username ||
                    `FID ${user.fid}`}
                </div>
                {(user.username || user.fid) && (
                  <div className='text-sm text-muted-foreground mb-2'>
                    {user.username ? `@${user.username}` : ''}
                    {user.username && user.fid ? ' · ' : ''}
                    {user.fid ? `fid ${user.fid}` : ''}
                  </div>
                )}
                {/* Location */}
                {(user.location?.description ||
                  neynarProfile?.location?.description) && (
                  <div className='text-sm text-muted-foreground'>
                    📍 {user.location?.description ||
                      neynarProfile?.location?.description}
                  </div>
                )}
              </div>

              {/* Stats Section */}
              {neynarProfile && (
                <div className='bg-muted/30 rounded-lg p-4 mb-6'>
                  <div className='flex justify-center gap-8'>
                    <div className='text-center'>
                      <div className='text-foreground font-semibold text-lg'>
                        {neynarProfile.following_count?.toLocaleString() || '-'}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Following
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-foreground font-semibold text-lg'>
                        {neynarProfile.follower_count?.toLocaleString() || '-'}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Followers
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio Section */}
              {(neynarProfile?.profile?.bio?.text || user.bio) && (
                <div className='bg-muted/20 rounded-lg p-4 mb-6'>
                  <div className='text-sm text-foreground leading-relaxed'>
                    {neynarProfile?.profile?.bio?.text || user.bio}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {neynarProfile?.social_verifications && (
                <div className='flex justify-center gap-6'>
                  {neynarProfile.social_verifications.twitter && (
                    <button
                      onClick={() =>
                        openUrl(
                          `https://twitter.com/${neynarProfile.social_verifications.twitter}`
                        )
                      }
                      className='flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors'
                    >
                      <span className='text-sm'>🐦</span>
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
                      className='flex items-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-gray-500/20 transition-colors'
                    >
                      <span className='text-sm'>🐙</span>
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
