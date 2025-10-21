'use client';

import dynamic from 'next/dynamic';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

const Demo = dynamic(() => import('../components/Demo'), {
  ssr: false,
});

export default function TestPage() {
  const { isFrameReady, setFrameReady } = useMiniKit();

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `context.user.fid`.
  // Uncomment if you need authentication
  // const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
  //   "/api/auth",
  //   { method: "GET" }
  // );

  return <Demo />;
}
