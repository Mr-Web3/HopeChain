'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ConditionalSafeArea } from './components/ConditionalSafeArea';
import { ReactNode } from 'react';
// import Provider from './components/providers/WagmiProvider';
import FrameProvider from './components/FrameProvider';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { config } from '../lib/unified-wagmi-config';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <MiniKitProvider
            enabled={true}
            notificationProxyUrl='/api/notify'
            autoConnect={false}
          >
            <FrameProvider>
              <ConditionalSafeArea isMiniKitEnabled={true}>
                {children}
              </ConditionalSafeArea>
            </FrameProvider>
          </MiniKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
