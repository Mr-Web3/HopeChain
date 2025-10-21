import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const METADATA = {
  name: 'HopeChain',
  description:
    'Transparent giving for cancer patients. Every USDC donation earns yield in secure Morpho vaults, creating an ever-growing fund for cancer patients. 100% of donations go directly to patients — no middlemen, no hidden fees, fully onchain.',
  homeUrl: process.env.NEXT_PUBLIC_APP_URL,
  image: `${process.env.NEXT_PUBLIC_APP_URL}/hopeLogo.png`,
  iconImageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/hopeLogo.png`,
  splashBackgroundColor: '#0b1020',
  twitter: '@DecentralBros_',
  github: process.env.NEXT_PUBLIC_GITHUB_URL,
};
