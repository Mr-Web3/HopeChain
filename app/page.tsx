/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';
import { useFrameContext } from './components/FrameProvider';
import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
import {
  FaHeart,
  FaChartLine,
  FaSeedling,
  // FaUserFriends,
  FaSearch,
  // FaShieldAlt,
  FaEye,
  FaUserMd,
  FaBan,
  FaUsers,
  FaHandHoldingHeart,
  FaMicroscope,
  FaCapsules,
} from 'react-icons/fa';
import {
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  // HiOutlineGlobe,
  // HiOutlineLightBulb,
} from 'react-icons/hi';

// Import our new UI components
import { HeroSection } from './components/ui/HeroSection';
import { SectionHeading } from './components/ui/SectionHeading';
import { FeatureCard } from './components/ui/FeatureCard';
import { MetricCard } from './components/ui/MetricCard';
import { ContentCard } from './components/ui/ContentCard';
import { MiniFeature } from './components/ui/MiniFeature';
import { PersonalStory } from './components/ui/PersonalStory';
import { Footer } from './components/ui/Footer';
import { MobileStickyCTA } from './components/ui/MobileStickyCTA';
import { LeaderboardSection } from './components/leaderboard/LeaderboardSection';
import { useVaultMetrics } from './hooks/useVaultMetrics';

export default function Home() {
  const frameContext = useFrameContext();
  const isInMiniApp = frameContext?.isInMiniApp ?? false;
  const context = frameContext?.context;
  const vaultMetrics = useVaultMetrics();

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <div className='min-h-screen bg-background'>
      <main
        className='max-w-7xl mx-auto px-6 sm:px-8 py-16 pb-24 md:pb-16'
        role='main'
        aria-label='HopeChain - Transparent Giving for Cancer Patients'
      >
        {/* Hero Section */}
        <HeroSection
          title='Transparent Giving. Real Healing.'
          subtitle='Every USDC donation earns yield in secure Morpho vaults, creating an ever-growing fund for cancer patients.'
          description='100% of donations go directly to patients — no middlemen, no hidden fees, fully onchain.'
          logo={{
            src: '/hopeLogo.png',
            alt: 'HopeChain Logo',
            width: 160,
            height: 160,
          }}
          username={
            isInMiniApp && (context as any)?.user
              ? (context as any).user.username
              : undefined
          }
          primaryAction={{
            label: 'Donate in USDC',
            href: '/donate',
            icon: <FaHeart />,
          }}
          secondaryAction={{
            label: 'View Transparency',
            href: '/impact',
            icon: <FaSearch />,
          }}
          badge={{
            text: 'Built on Base • 100% Transparent • DeFi Powered',
            icon: true,
          }}
        />

        {/* How It Works */}
        <section className='section-spacing'>
          <SectionHeading
            title='How HopeChain Works'
            description='A simple, transparent process that turns your donations into sustainable aid'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch'>
            <FeatureCard
              step={1}
              title='Donate USDC'
              description='Donate using Coinbase Pay, WalletConnect, or MetaMask'
              icon={<FaHeart />}
              gradientFrom='blue-500'
              gradientTo='purple-600'
              delay={0.1}
            />
            <FeatureCard
              step={2}
              title='Earn Yield'
              description='Funds earn yield in secure Morpho vaults'
              icon={<FaChartLine />}
              gradientFrom='purple-500'
              gradientTo='pink-600'
              delay={0.2}
            />
            <FeatureCard
              step={3}
              title='Grow Vault'
              description='Your donation becomes an ever-growing source of aid'
              icon={<FaSeedling />}
              gradientFrom='pink-500'
              gradientTo='red-600'
              delay={0.3}
            />
            <FeatureCard
              step={4}
              title='Help Patients'
              description='100% of funds go directly to verified cancer patients'
              icon={<FaHandHoldingHeart />}
              gradientFrom='green-500'
              gradientTo='blue-600'
              delay={0.4}
            />
          </div>
        </section>

        {/* Transparency Dashboard */}
        <section className='section-spacing'>
          <SectionHeading
            title='Live Transparency Dashboard'
            description='Real-time metrics showing the impact of your donations'
          />

          <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6'>
            <MetricCard
              icon={<HiOutlineCurrencyDollar />}
              title='Total Donated'
              value={
                vaultMetrics.isLoading
                  ? 'Loading...'
                  : `$${vaultMetrics.totalDonated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
              subtext='Live on-chain data'
              gradientFrom='blue-500'
              gradientTo='purple-500'
              tooltip='Total USDC donations received across all campaigns'
              delay={0.1}
            />
            <MetricCard
              icon={<HiOutlineTrendingUp />}
              title='Yield Earned'
              value={
                vaultMetrics.isLoading
                  ? 'Loading...'
                  : `$${vaultMetrics.yieldEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
              subtext='From Morpho vault'
              gradientFrom='purple-500'
              gradientTo='pink-500'
              tooltip='Interest earned from Morpho vault investments'
              delay={0.2}
            />
            <MetricCard
              icon={<HiOutlineCurrencyDollar />}
              title='Vault Total'
              value={
                vaultMetrics.isLoading
                  ? 'Loading...'
                  : `$${vaultMetrics.vaultTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
              subtext='Principal + Yield'
              gradientFrom='cyan-500'
              gradientTo='green-500'
              tooltip='Total value currently held in the Morpho vault (donations + yield)'
              delay={0.25}
            />
            <MetricCard
              icon={<FaUsers />}
              title='Hope Givers'
              value={
                vaultMetrics.isLoading
                  ? 'Loading...'
                  : vaultMetrics.hopeGivers.toLocaleString()
              }
              subtext='Unique donors'
              gradientFrom='pink-500'
              gradientTo='red-500'
              tooltip='Number of unique donors who have contributed'
              delay={0.3}
            />
            <MetricCard
              icon={<FaHandHoldingHeart />}
              title='Lives Changed'
              value={
                vaultMetrics.isLoading
                  ? 'Loading...'
                  : vaultMetrics.livesChanged.toLocaleString()
              }
              subtext='Patients funded'
              gradientFrom='green-500'
              gradientTo='blue-500'
              tooltip='Number of cancer patients who received financial assistance'
              delay={0.35}
            />
          </div>
        </section>

        {/* Top Hope Givers Leaderboard */}
        <LeaderboardSection
          title='Top Hope Givers'
          description='Recognizing our most generous donors — every USDC changes a life.'
        />

        {/* Our Mission */}
        <section className='section-spacing'>
          <ContentCard
            title='Fighting Back Against Medical Bureaucracy'
            description='Traditional insurance companies dictate what treatments patients can receive, often denying experimental or alternative therapies that could save lives. HopeChain changes that. We empower patients with unrestricted access to funds for the treatments they choose. Every transaction is transparent, every dollar earns yield, and every patient gets the care they deserve — not what an insurance company decides.'
            gradientFrom='blue-500'
            gradientTo='purple-500'
            delay={0.1}
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <MiniFeature
                icon={<FaBan />}
                title='No Insurance Barriers'
                description='Patients choose their treatments, not insurance companies'
                gradientFrom='red-500'
                gradientTo='pink-600'
                delay={0.2}
              />
              <MiniFeature
                icon={<FaEye />}
                title='100% Transparent'
                description='Every donation and payout is traceable onchain'
                gradientFrom='blue-500'
                gradientTo='cyan-600'
                delay={0.3}
              />
              <MiniFeature
                icon={<FaSeedling />}
                title='Sustainable Growth'
                description='DeFi yield ensures the fund grows over time'
                gradientFrom='green-500'
                gradientTo='emerald-600'
                delay={0.4}
              />
            </div>
          </ContentCard>
        </section>

        {/* Personal Story */}
        <section className='section-spacing'>
          <PersonalStory
            title='Why HopeChain Exists'
            subtitle='In Honor of My Grandfather'
            icon={<FaHeart />}
            delay={0.1}
          >
            <div className='space-y-6'>
              {/* Introduction */}
              <div className='text-center mb-8'>
                <p className='text-lg text-muted-foreground leading-relaxed'>
                  Every family touched by cancer deserves access to the best
                  treatments, not what insurance companies decide they can
                  afford. HopeChain was born from this belief — that no one
                  should have to choose between financial ruin and fighting for
                  their life.
                </p>
              </div>

              {/* Grandfather's Photo and Story */}
              <div className='mb-8'>
                {/* Photo - Float left on desktop */}
                <div className='float-left mr-6 mb-4 lg:mb-6'>
                  <div className='relative w-48 h-48 lg:w-56 lg:h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20'>
                    <Image
                      src='/grandpaTwo.jpg'
                      alt='My grandfather - the inspiration behind HopeChain'
                      fill
                      className='object-cover'
                      priority
                    />
                  </div>
                </div>

                {/* Story Header */}
                <div className='text-center lg:text-left mb-6'>
                  <h3 className='text-xl font-bold text-foreground mb-2'>
                    In Memory of My Grandfather
                  </h3>
                  <p className='text-primary font-medium text-base'>
                    The inspiration behind HopeChain
                  </p>
                </div>

                {/* The Story - Text flows around photo */}
                <div className='space-y-6 clear-both'>
                  <p className='text-foreground leading-relaxed'>
                    <strong className='text-primary'>
                      This journey is deeply personal.
                    </strong>
                  </p>

                  <p className='text-foreground leading-relaxed'>
                    It began when my grandfather, my{' '}
                    <em className='text-primary font-semibold'>
                      closest friend
                    </em>{' '}
                    and the man who taught me to love music, was diagnosed with
                    prostate cancer.
                  </p>

                  <p className='text-foreground leading-relaxed'>
                    We were the only two musicians in the family — playing
                    guitar, drums, and just about anything we could make sing.
                    He lived a full life, traveling and performing, sharing
                    music wherever he went. When we found out about his cancer,
                    we thought we had time… maybe even a chance to beat it. But
                    it spread through his body faster than anyone could have
                    imagined. I watched him fade — some days unable to move,
                    other days trying to jam with me even though every small
                    injury or touch would bring him{' '}
                    <strong className='text-destructive'>
                      unbearable pain
                    </strong>
                    .
                  </p>

                  <div className='bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg'>
                    <p className='text-foreground leading-relaxed italic'>
                      One day during chemo, he looked at me and said something
                      I&apos;ll never forget:
                    </p>
                    <blockquote className='mt-4 text-lg font-medium text-foreground leading-relaxed'>
                      &quot;I love you, and I love God. But it would be nice if
                      I didn&apos;t have to fight so hard — or do everything
                      these insurance companies tell me — just to live.
                      They&apos;re not trying to heal me, they&apos;re just
                      pumping poison into my body. We get cancer like a common
                      cold now because of all the poison they put in our food —
                      the dyes, the additives, the chemicals — all to keep us
                      sick. They drive luxury cars and live in mansions while
                      people like me suffer in these chairs. The money they
                      raise, only a fraction goes to research. The rest goes to
                      their pockets. There&apos;s no cure because they
                      won&apos;t allow one — they&apos;d lose billions.&quot;
                    </blockquote>
                  </div>

                  <p className='text-foreground leading-relaxed'>
                    He told me something that changed how I see the world:
                  </p>

                  <div className='bg-muted/30 border-l-4 border-secondary p-6 rounded-r-lg'>
                    <blockquote className='text-lg font-medium text-foreground leading-relaxed'>
                      &quot;Every time they hook me up to this chemo, they make
                      over <strong className='text-primary'>$500,000</strong>.
                      I&apos;ve paid for health insurance my whole life, and now
                      they tell me I can&apos;t try anything experimental
                      because it &apos;violates policy.&apos; I deserve the
                      right to a cure — or at least the right to try.&quot;
                    </blockquote>
                  </div>

                  <p className='text-foreground leading-relaxed'>
                    They wanted to put him in a nursing home under hospice care.
                    But he refused.
                  </p>

                  <div className='bg-muted/30 border-l-4 border-accent p-6 rounded-r-lg'>
                    <blockquote className='text-lg font-medium text-foreground leading-relaxed'>
                      &quot;I&apos;d die faster surrounded by death,&quot; he
                      said. &quot;I&apos;m only 72. Being away from family would
                      destroy my will to fight.&quot;
                    </blockquote>
                  </div>

                  <p className='text-foreground leading-relaxed'>
                    So I asked him what he wanted most — what would keep him
                    strong and give him peace.
                  </p>

                  <p className='text-foreground leading-relaxed'>
                    He said,{' '}
                    <em className='text-primary font-semibold'>
                      &quot;I want a home in the woods — somewhere quiet, where
                      I can fight or, if I can&apos;t beat it, die peacefully in
                      my own bed.&quot;
                    </em>
                  </p>

                  <p className='text-foreground leading-relaxed'>
                    I didn&apos;t have the money, but I found a way. I bought a
                    small home in rural Georgia, fixed it up, and gave him
                    exactly what he wished for —{' '}
                    <strong className='text-primary'>peace</strong>. I built him
                    a music room so he could still play, even on his weakest
                    days.
                  </p>

                  <p className='text-foreground leading-relaxed'>
                    He fought hard. But seven months later, just two days before
                    my birthday, he passed away in his sleep — in his bed, in
                    his home, just as he wanted.
                  </p>

                  {/* Carrying His Legacy Forward */}
                  <div className='mt-8 pt-6 border-t border-border/50'>
                    <h4 className='text-xl font-bold text-foreground mb-4 text-center'>
                      <span className='text-primary'>
                        Carrying His Legacy Forward
                      </span>
                    </h4>

                    <p className='text-foreground leading-relaxed mb-4'>
                      <strong className='text-primary'>
                        This site — this mission — is built in his honor.
                      </strong>
                    </p>

                    <p className='text-foreground leading-relaxed mb-4'>
                      It&apos;s dedicated to everyone fighting cancer, and to
                      the countless families who&apos;ve been torn apart by a
                      system that profits from pain instead of healing.
                    </p>

                    <p className='text-foreground leading-relaxed mb-4'>
                      <strong className='text-secondary-foreground'>
                        It&apos;s time for a change.
                      </strong>
                    </p>

                    <p className='text-foreground leading-relaxed mb-4'>
                      We live in a world poisoned by greed — chemicals in our
                      food, toxins in our water, profit in our sickness. But we
                      can build something better. We can use technology to give
                      people real options — to empower them to say no to Big
                      Pharma, to access experimental treatments, to support
                      doctors and scientists who truly want to find cures
                      instead of maintaining control.
                    </p>

                    <p className='text-foreground leading-relaxed mb-4'>
                      This movement is about people helping people — using
                      innovation, compassion, and truth to bring hope where the
                      system has failed.
                    </p>

                    <div className='bg-muted/30 border border-primary/20 p-6 rounded-lg text-center'>
                      <p className='text-lg font-semibold text-foreground mb-2'>
                        <strong className='text-primary'>
                          Together, we are strong.
                        </strong>
                      </p>
                      <p className='text-lg font-semibold text-foreground mb-2'>
                        <strong className='text-secondary-foreground'>
                          Together, we can build technology that heals — not
                          harms.
                        </strong>
                      </p>
                      <p className='text-lg font-semibold text-foreground'>
                        <strong className='text-primary'>
                          Together, we can make a difference.
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PersonalStory>
        </section>

        {/* Research & Cure Development */}
        <section className='section-spacing'>
          <ContentCard
            title='Funding the Future of Cancer Treatment'
            description="Beyond helping individual patients, HopeChain funds breakthrough research and development of new cancer treatments. We support real doctors and scientists working to find cures that could save millions of lives. A portion of every donation goes directly to cutting-edge research institutions, clinical trials, and innovative treatment development. Your contribution doesn't just help one person — it helps fund the discoveries that could end cancer for everyone."
            gradientFrom='purple-500'
            gradientTo='pink-500'
            delay={0.1}
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <MiniFeature
                icon={<FaMicroscope />}
                title='Research Funding'
                description='Direct support for breakthrough cancer research'
                gradientFrom='purple-500'
                gradientTo='indigo-600'
                delay={0.2}
              />
              <MiniFeature
                icon={<FaUserMd />}
                title='Real Scientists'
                description='Funding actual doctors and researchers, not bureaucracy'
                gradientFrom='blue-500'
                gradientTo='cyan-600'
                delay={0.3}
              />
              <MiniFeature
                icon={<FaCapsules />}
                title='Cure Development'
                description='Supporting the development of life-saving treatments'
                gradientFrom='green-500'
                gradientTo='teal-600'
                delay={0.4}
              />
            </div>
          </ContentCard>
        </section>

        {/* Footer */}
        <Footer
          title='Trusted Partners'
          description='Built on the most trusted and secure blockchain infrastructure in the world'
          partners={[
            {
              name: 'Morpho Protocol',
              logo: '/logos/morpho.jpeg',
              description: 'DeFi Lending',
            },
            {
              name: 'Coinbase',
              logo: '/logos/coinbase.png',
              description: 'Web3 Platform',
            },
            {
              name: 'Base Network',
              logo: '/logos/baseChain.png',
              description: 'Ethereum L2',
            },
            {
              name: 'Base App',
              logo: '/logos/base.png',
              description: 'Mobile Wallet',
            },
            {
              name: 'Farcaster',
              logo: '/logos/farcaster.png',
              description: 'Social Protocol',
            },
          ]}
          links={[
            { label: 'Transparency Report', href: '/impact' },
            { label: 'Donate', href: '/donate' },
            { label: 'Apply', href: '/apply' },
          ]}
        />

        {/* Mobile Sticky CTA */}
        <MobileStickyCTA
          primaryAction={{
            label: 'Donate USDC',
            href: '/donate',
            icon: <FaHeart />,
          }}
          secondaryAction={{
            label: 'View Impact',
            href: '/impact',
            icon: <FaSearch />,
          }}
        />
      </main>
    </div>
  );
}
