import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { baseAccount } from 'wagmi/connectors';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { METADATA } from './utils';

// Create the base wagmi config with our custom connectors
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
    ),
  },
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: METADATA.name,
      appLogoUrl: METADATA.iconImageUrl,
    }),
  ],
});

// Create RainbowKit config using the same chains but with RainbowKit's connectors
export const rainbowkitConfig = getDefaultConfig({
  appName: 'HopeChain',
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base, baseSepolia],
  ssr: true,
});

// Export the wagmi config as the main config for consistency
export const config = wagmiConfig;
