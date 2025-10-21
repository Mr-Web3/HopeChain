import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia, mainnet } from 'wagmi/chains';
import { http } from 'viem';
import { METADATA } from './utils';

// Single RainbowKit config for all platforms with mainnet for ENS resolution
export const config = getDefaultConfig({
  appName: METADATA.name,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [base, baseSepolia, mainnet], // Include mainnet for ENS resolution
  ssr: true,
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base.org'
    ),
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
    ),
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    ),
  },
});

// Export the same config for consistency
export const rainbowkitConfig = config;
