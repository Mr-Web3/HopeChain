// Quick debug script to check what connectors are available
const { createConfig, http } = require('wagmi');
const { base, optimism } = require('wagmi/chains');
const {
  baseAccount,
  walletConnect,
  injected,
  coinbaseWallet,
} = require('wagmi/connectors');
const { farcasterMiniApp } = require('@farcaster/miniapp-wagmi-connector');

const METADATA = {
  name: 'HopeChain',
  description:
    'Transparent, yield-powered cancer funding built on Base. Every dollar helps real patients — not corporations.',
  bannerImageUrl: '/hero.png',
  iconImageUrl: '/hopeLogo.png',
  homeUrl: process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
  splashBackgroundColor: '#FFFFFF',
};

const config = createConfig({
  chains: [base, optimism],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: METADATA.name,
      appLogoUrl: METADATA.iconImageUrl,
    }),
    injected(),
    coinbaseWallet({
      appName: METADATA.name,
      appLogoUrl: METADATA.iconImageUrl,
    }),
    ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
      ? [
          walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            metadata: {
              name: METADATA.name,
              description: METADATA.description,
              url: METADATA.homeUrl,
              icons: [METADATA.iconImageUrl],
            },
          }),
        ]
      : []),
  ],
});

console.log('Available connectors:');
config.connectors.forEach((connector, index) => {
  console.log(`${index}: ${connector.name} (${connector.type})`);
});
