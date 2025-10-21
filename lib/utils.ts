import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const METADATA = {
  name: 'HopeChain',
  description:
    'Transparent giving for cancer patients. Every USDC donation earns yield in secure Morpho vaults, creating an ever-growing fund for cancer patients. 100% of donations go directly to patients — no middlemen, no hidden fees, fully onchain.',
  homeUrl: 'https://hopechain.vercel.app',
  image: 'https://hopechain.vercel.app/og-image.png',
  iconImageUrl: 'https://hopechain.vercel.app/icon.png',
  splashBackgroundColor: '#0b1020',
  twitter: '@hopechain',
  github: 'https://github.com/hopechain/hopechain',
};
