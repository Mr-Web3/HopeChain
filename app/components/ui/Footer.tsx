'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { FaGlobe } from 'react-icons/fa6';
import { FaXTwitter } from 'react-icons/fa6';

interface Partner {
  name: string;
  icon?: ReactNode;
  logo?: string;
  href?: string;
  description?: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  title: string;
  description: string;
  partners: Partner[];
  links: FooterLink[];
  className?: string;
}

export function Footer({
  title,
  description,
  partners,
  links,
  className,
}: FooterProps) {
  const openUrl = useOpenUrl();
  return (
    <footer className={cn('mt-24 border-t border-black/20', className)}>
      <div className='max-w-7xl mx-auto px-6 sm:px-8 py-16'>
        {/* Trusted Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-4'>
            {title}
          </h2>
          <p className='text-muted-foreground mb-12 max-w-3xl mx-auto text-lg'>
            {description}
          </p>

          {/* Partners Grid */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8'>
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
                className='group'
              >
                <Card className='p-6 bg-gradient-to-br from-background to-muted/20 border border-border/50 hover:border-primary/30 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[120px]'>
                  <div className='flex flex-col items-center gap-3 text-center'>
                    {/* Logo or Icon */}
                    <div className='w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all duration-300'>
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={32}
                          height={32}
                          className='object-contain'
                        />
                      ) : partner.icon ? (
                        <span className='text-xl text-primary group-hover:scale-110 transition-transform duration-200'>
                          {partner.icon}
                        </span>
                      ) : (
                        <div className='w-8 h-8 bg-primary/20 rounded-full' />
                      )}
                    </div>

                    {/* Company Name */}
                    <div className='space-y-1'>
                      <h3 className='text-foreground font-semibold text-sm md:text-base group-hover:text-primary transition-colors duration-200'>
                        {partner.name}
                      </h3>
                      {partner.description && (
                        <p className='text-xs text-muted-foreground leading-tight'>
                          {partner.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Built on Base Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className='text-center mb-8'
        >
          <Badge
            variant='outline'
            className='px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 text-foreground font-medium'
          >
            <span className='w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse' />
            Built on Base
          </Badge>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className='flex flex-wrap justify-center gap-6 mb-8'
        >
          {links.map(link => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ scale: 1.05 }}
              className='text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium'
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='flex flex-col justify-center items-center text-center text-muted-foreground text-sm'
        >
          <p>&copy; 2025 HopeChain. All rights reserved.</p>
          <p className='mt-2'>
            Transparent giving. Real healing. Built on Base.
          </p>
          <p className='mt-4 text-foreground font-medium'>
            Built by Justin @Decentral Bros
          </p>

          {/* Social Icons */}
          <div className='flex items-center justify-center gap-4 mt-4'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openUrl('https://www.decentralbros.io')}
              className='p-2 rounded-md bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 border border-border/50 hover:border-primary/30 transition-all duration-200'
              aria-label='Visit our website'
            >
              <FaGlobe className='w-5 h-5 text-foreground hover:text-primary transition-colors duration-200' />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openUrl('https://justin.dbro.dev')}
              className='p-2 rounded-md bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 border border-border/50 hover:border-primary/30 transition-all duration-200'
              aria-label='Follow us on X'
            >
              <FaXTwitter className='w-5 h-5 text-foreground hover:text-primary transition-colors duration-200' />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
