'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { ConditionalSafeArea } from './components/ConditionalSafeArea';
import { ReactNode, useState, useEffect } from 'react';
import FrameProvider from './components/FrameProvider';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { useTheme } from 'next-themes';
import { config } from '../lib/unified-wagmi-config';

const queryClient = new QueryClient();

function RainbowKitWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use a stable theme that won't cause hydration issues
  const currentTheme = mounted ? (resolvedTheme || 'light') : 'light';
  
  return (
    <RainbowKitProvider
      theme={currentTheme === 'dark' ? darkTheme() : lightTheme()}
    >
      <MiniKitProvider
        enabled={true}
        notificationProxyUrl='/api/notify'
        autoConnect={true}
      >
        <FrameProvider>
          <ConditionalSafeArea isMiniKitEnabled={true}>
            {children}
          </ConditionalSafeArea>
        </FrameProvider>
      </MiniKitProvider>
    </RainbowKitProvider>
  );
}

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
          <RainbowKitWrapper>
            {children}
          </RainbowKitWrapper>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
