/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useFrameContext } from './FrameProvider';
import { sdk } from '@farcaster/miniapp-sdk';
import {
  FullWalletConnect,
  SignMessage,
  SignSiweMessage,
  SendEth,
  SignTypedData,
  SwitchChain,
} from './wallet/WalletConnect';

export default function Demo() {
  const frameContext = useFrameContext();
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest?.('[data-profile-popover]') &&
        !target.closest?.('[data-profile-trigger]')
      ) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('click', onWindowClick);
    return () => window.removeEventListener('click', onWindowClick);
  }, []);

  const user = (frameContext?.context as any)?.user;

  return (
    <div
      style={{
        marginTop:
          (frameContext?.context as any)?.client?.safeAreaInsets?.top ?? 0,
        marginBottom:
          (frameContext?.context as any)?.client?.safeAreaInsets?.bottom ?? 0,
        marginLeft:
          (frameContext?.context as any)?.client?.safeAreaInsets?.left ?? 0,
        marginRight:
          (frameContext?.context as any)?.client?.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className='w-[95%] max-w-lg mx-auto py-4 px-4'>
        <div className='mb-6 mt-3 flex items-center justify-between relative'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='/hopeLogo.png'
            alt='HopeChain'
            className='h-8 object-contain'
          />

          {user?.pfpUrl && (
            <button
              type='button'
              data-profile-trigger
              onClick={e => {
                e.stopPropagation();
                setIsProfileOpen(prev => !prev);
              }}
              className='flex-shrink-0'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.pfpUrl}
                alt='Profile'
                className='h-8 w-8 rounded-full object-cover'
              />
            </button>
          )}

          {isProfileOpen && user && (
            <div
              data-profile-popover
              className='absolute right-0 top-12 w-80 bg-white border border-border rounded-xl shadow-lg p-4 z-50'
              onClick={e => e.stopPropagation()}
            >
              <div className='flex items-start gap-3'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.pfpUrl}
                  alt='Profile'
                  className='h-12 w-12 rounded-full object-cover'
                />
                <div className='min-w-0'>
                  <div className='text-foreground font-semibold truncate'>
                    {user.displayName || user.username || `FID ${user.fid}`}
                  </div>
                  {(user.username || user.fid) && (
                    <div className='text-sm text-muted-foreground truncate'>
                      {user.username ? `@${user.username}` : ''}
                      {user.username && user.fid ? ' · ' : ''}
                      {user.fid ? `fid ${user.fid}` : ''}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-4 grid gap-2'>
                <button
                  type='button'
                  onClick={() => sdk.actions.viewProfile({ fid: user.fid })}
                  className='w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity'
                >
                  View Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Actions */}
        <div className='space-y-4'>
          <div className='bg-white border border-border rounded-xl p-4'>
            <h3 className='text-lg font-semibold mb-4'>Wallet Actions</h3>
            <div className='space-y-3'>
              <FullWalletConnect />
              <SignMessage />
              <SignSiweMessage />
              <SendEth />
              <SignTypedData />
              <SwitchChain />
            </div>
          </div>

          {/* Frame Context Debug */}
          <div className='bg-white border border-border rounded-xl p-4'>
            <h3 className='text-lg font-semibold mb-4'>Frame Context</h3>
            <div className='text-sm'>
              <div className='mb-2'>
                <strong>Is in Mini App:</strong>{' '}
                {frameContext?.isInMiniApp ? 'Yes' : 'No'}
              </div>
              {user && (
                <div className='mb-2'>
                  <strong>User:</strong>
                  <pre className='mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto'>
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              )}
              <div>
                <strong>Full Context:</strong>
                <pre className='mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40'>
                  {JSON.stringify(frameContext?.context, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
