'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { rainbowkitConfig } from '../../../lib/unified-wagmi-config';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

// Custom theme matching your site's design
const customTheme = darkTheme({
  accentColor: '#0052ff', // Your brand blue
  accentColorForeground: '#e7eaf3', // Your fg color
  borderRadius: 'medium',
  overlayBlur: 'small',
});

export function DesktopProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={rainbowkitConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
