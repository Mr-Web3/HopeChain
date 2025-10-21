'use client';

import { SafeArea } from '@coinbase/onchainkit/minikit';
import { ReactNode } from 'react';

interface ConditionalSafeAreaProps {
  children: ReactNode;
  isMiniKitEnabled: boolean;
}

export function ConditionalSafeArea({
  children,
  isMiniKitEnabled,
}: ConditionalSafeAreaProps) {
  // Only render SafeArea when MiniKit is enabled (mobile/mini app)
  if (isMiniKitEnabled) {
    return <SafeArea>{children}</SafeArea>;
  }

  // For desktop (RainbowKit), just return children without SafeArea
  return <>{children}</>;
}
