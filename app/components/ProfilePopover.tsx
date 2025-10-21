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
              {/* Profile Photo - Top Center with Theme Toggle */}
              <div className='flex items-center justify-center mb-4 gap-4'>
                {/* Theme Toggle - Left of Profile Photo */}
                <ThemeToggle />

                {/* Profile Photo - Center */}
                {user.pfpUrl ? (
                  <Image
                    src={user.pfpUrl}
                    alt='Profile'
                    className='h-20 w-20 rounded-md object-cover'
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className='h-20 w-20 rounded-xl bg-muted' />
                )}

                {/* Spacer to balance the layout */}
                <div className='w-9 h-9' />
              </div>

              {/* Username and FID */}
              <div className='text-center mb-4'>
                <div className='text-foreground font-semibold text-lg'>
                  {neynarProfile?.display_name ||
                    user.displayName ||
                    user.username ||
                    `FID ${user.fid}`}
                </div>
                {(user.username || user.fid) && (
                  <div className='text-sm text-muted-foreground'>
                    {user.username ? `@${user.username}` : ''}
                    {user.username && user.fid ? ' · ' : ''}
                    {user.fid ? `fid ${user.fid}` : ''}
                  </div>
                )}
                {/* Location - Right below username and FID */}
                {(user.location?.description ||
                  neynarProfile?.location?.description) && (
                  <div className='text-xs text-muted-foreground mt-1'>
                    {user.location?.description ||
                      neynarProfile?.location?.description}
                  </div>
                )}
              </div>

              {/* Following and Followers from Neynar */}
              {neynarProfile && (
                <div className='flex justify-center gap-8 mb-4'>
                  <div className='text-center'>
                    <div className='text-foreground font-semibold'>
                      Following
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {neynarProfile.following_count?.toLocaleString() || '-'}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-foreground font-semibold'>
                      Followers
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {neynarProfile.follower_count?.toLocaleString() || '-'}
                    </div>
                  </div>
                </div>
              )}

              {/* Bio */}
              <div className='text-center mb-6'>
                {(neynarProfile?.profile?.bio?.text || user.bio) && (
                  <div className='text-sm text-muted-foreground'>
                    {neynarProfile?.profile?.bio?.text || user.bio}
                  </div>
                )}
                {!neynarProfile?.profile?.bio?.text && !user.bio && (
                  <div className='text-sm text-muted-foreground'>
                    No bio available
                  </div>
                )}
              </div>

              {/* Social Links */}
              {neynarProfile?.social_verifications && (
                <div className='flex justify-center gap-4 mb-4'>
                  {neynarProfile.social_verifications.twitter && (
                    <button
                      onClick={() =>
                        openUrl(
                          `https://twitter.com/${neynarProfile.social_verifications.twitter}`
                        )
                      }
                      className='text-primary hover:text-primary/80 text-sm transition-colors'
                    >
                      @{neynarProfile.social_verifications.twitter}
                    </button>
                  )}
                  {neynarProfile.social_verifications.github && (
                    <button
                      onClick={() =>
                        openUrl(
                          `https://github.com/${neynarProfile.social_verifications.github}`
                        )
                      }
                      className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                    >
                      @{neynarProfile.social_verifications.github}
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
