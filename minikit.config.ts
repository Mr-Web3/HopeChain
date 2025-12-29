const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://hope-chain-five.vercel.app');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      'eyJmaWQiOjc4ODgwMCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDQzOTI5OEVmQUQzMEY2MjgyMWM4NWI2NUFkNzVlN0MwNDFlMzY2RDcifQ',
    payload: 'eyJkb21haW4iOiJob3BlLWNoYWluLWZpdmUudmVyY2VsLmFwcCJ9',
    signature:
      'awENQzWNfUYOBMHYCTlXo0j4xme35nqL/VSnXAbLZVpmnr9B+pNLacL5ugsoe+N19Brxg6FY63RHb35HqKhpwhw=',
  },
  baseBuilder: {
    allowedAddresses: ['0x1d0B2cfeBaBB59b3AF59ff77DeF5397Ce4Be9e77'],
  },
  miniapp: {
    version: '1',
    name: 'HopeChain',
    subtitle: 'Hope, Onchain',
    description:
      'Transparent, onchain funding for real cancer treatments — powered by decentralized finance, not corporate overhead.',
    screenshotUrls: [`${ROOT_URL}/screenshot1.jpg`, `${ROOT_URL}/screenshot2.jpg`, `${ROOT_URL}/screenshot3.jpg`],
    iconUrl: `${ROOT_URL}/hopeLogo.png`,
    splashImageUrl: `${ROOT_URL}/hopeLogo.png`,
    splashBackgroundColor: '#06090E',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'health-fitness',
    tags: ['health', 'donation', 'cancer', 'aid', 'charity'],
    heroImageUrl: `${ROOT_URL}/hopeLogo.png`,
    tagline: 'Giving and Healing.',
    ogTitle: 'HopeChain',
    ogDescription: 'Every Transaction Tells a Story of Hope.',
    ogImageUrl: `${ROOT_URL}/hopeLogo.png`,
    noindex: true,
  },
} as const;
