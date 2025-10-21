'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface MiniAppClient {
  platformType?: 'web' | 'mobile';
  clientFid: number;
  added: boolean;
  safeAreaInsets?: SafeAreaInsets;
  notificationDetails?: {
    url: string;
    token: string;
  };
}

interface MiniAppContext {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: Record<string, unknown>;
  client: MiniAppClient;
}

type FrameContextType = {
  context: MiniAppContext | Record<string, unknown> | null;
  isInMiniApp: boolean;
} | null;

const FrameContext = createContext<FrameContextType>(null);

export const useFrameContext = () => useContext(FrameContext);

export default function FrameProvider({ children }: { children: ReactNode }) {
  const [frameContext, setFrameContext] = useState<FrameContextType>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Farcaster SDK
        await sdk.actions.ready();

        // Get the actual context from Farcaster
        const context = await sdk.context;
        const isInMiniApp = Boolean(context);

        console.log('FrameProvider - initial context:', context);
        console.log('FrameProvider - isInMiniApp:', isInMiniApp);

        // Context should contain user data if available

        console.log('FrameProvider - final context:', context);
        console.log(
          'FrameProvider - user in context:',
          (context as MiniAppContext)?.user
        );
        setFrameContext({ context, isInMiniApp });

        // Events API not available in current SDK version
      } catch (error) {
        console.log('Not in Farcaster mini app environment:', error);
        setFrameContext({
          context: null,
          isInMiniApp: false,
        });
      }
    };

    init();
  }, []);

  return (
    <FrameContext.Provider value={frameContext}>
      {children}
    </FrameContext.Provider>
  );
}
