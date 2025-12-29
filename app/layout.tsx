import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'react-hot-toast';
import { METADATA } from '../lib/utils';
import { minikitConfig } from '../minikit.config';
import { Providers } from './providers';
import { AppLayout } from './components/layout/AppLayout';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: METADATA.name,
    description: METADATA.description,
    metadataBase: new URL(
      METADATA.homeUrl || 'https://hope-chain-five.vercel.app'
    ),
    keywords: [
      'base',
      'farcaster',
      'mini app',
      'nextjs',
      'cancer funding',
      'transparent giving',
      'morpho',
      'usdc',
    ],
    openGraph: {
      title: METADATA.name,
      description: METADATA.description,
      url: METADATA.homeUrl,
      siteName: METADATA.name,
      images: [
        {
          url: minikitConfig.miniapp.ogImageUrl,
          width: 1200,
          height: 630,
          alt: METADATA.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: METADATA.name,
      description: METADATA.description,
      images: [minikitConfig.miniapp.ogImageUrl],
    },
    icons: {
      icon: '/hopeLogo.png',
      apple: '/hopeLogo.png',
    },
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: minikitConfig.miniapp.heroImageUrl,
        button: {
          title: `Join ${METADATA.name}`,
          action: {
            name: `Launch ${METADATA.name}`,
            type: 'launch_frame',
            url: METADATA.homeUrl,
            splashImageUrl: METADATA.iconImageUrl,
            splashBackgroundColor: METADATA.splashBackgroundColor,
          },
        },
      }),
    },
  };
}

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const geist = GeistSans;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${sora.variable} ${geist.className} antialiased`}>
        <Providers>
          <AppLayout>{children}</AppLayout>
          <Toaster
            position='top-center'
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--accent))',
                },
              },
              error: {
                style: {
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--card-foreground))',
                  border: '1px solid hsl(var(--destructive))',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
