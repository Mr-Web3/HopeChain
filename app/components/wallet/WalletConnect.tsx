'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
  useWaitForTransactionReceipt,
  useDisconnect,
  useConnect,
  useSwitchChain,
  useChainId,
} from 'wagmi';
import { config } from '../../../lib/unified-wagmi-config';
import { Button } from '../ui/button';
import { base, baseSepolia } from 'wagmi/chains';
import { BaseError, UserRejectedRequestError } from 'viem';

import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { getNames } from '@coinbase/onchainkit/identity';
import { METADATA } from '../../../lib/utils';
import { SiweMessage } from 'siwe';

// justindbro.base.eth
const RECIPIENT_ADDRESS = '0x1d0B2cfeBaBB59b3AF59ff77DeF5397Ce4Be9e77';

const renderError = (error: Error | null): React.ReactElement | null => {
  if (!error) return null;
  if (error instanceof BaseError) {
    const isUserRejection = error.walk(
      e => e instanceof UserRejectedRequestError
    );

    if (isUserRejection) {
      return <div className='text-red-500 text-xs mt-1'>Rejected by user.</div>;
    }
  }

  return <div className='text-red-500 text-xs mt-1'>{error.message}</div>;
};

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, error: connectError } = useConnect();
  const [mounted, setMounted] = useState(false);
  const [baseName, setBaseName] = useState<string | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Resolve Base name when address changes
  useEffect(() => {
    const resolveNames = async () => {
      if (!address) {
        setBaseName(null);
        return;
      }

      try {
        // Get both ENS and Base names using OnchainKit
        const [ensNames, baseNames] = await Promise.all([
          getNames({ addresses: [address] }), // ENS names
          getNames({ addresses: [address], chain: base }), // Base names
        ]);

        // Prioritize Base name over ENS name
        const baseNameResult = baseNames[0];
        const ensNameResult = ensNames[0];

        if (baseNameResult && typeof baseNameResult === 'string') {
          setBaseName(baseNameResult);
        } else if (ensNameResult && typeof ensNameResult === 'string') {
          setBaseName(ensNameResult);
        } else {
          setBaseName(null);
        }
      } catch (error) {
        console.log('Could not resolve names:', error);
        setBaseName(null);
      }
    };

    resolveNames();
  }, [address]);

  if (!mounted) {
    return (
      <Button className='px-4 py-2' disabled>
        Connect Wallet
      </Button>
    );
  }

  if (isConnected && address) {
    const displayName =
      baseName || `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <div className='flex items-center gap-2'>
        <span className='text-sm text-fg-muted'>{displayName}</span>
        <Button
          onClick={() => disconnect()}
          variant='outline'
          size='sm'
          className='px-3 py-1'
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={() => {
          console.log('Connect Wallet clicked!');
          console.log(
            'Available connectors:',
            config.connectors.map(c => ({ name: c.name, type: c.type }))
          );

          // Try to connect with Base Account first (best for Base App), then Coinbase Wallet, then MetaMask
          const connector =
            config.connectors.find(c => c.type === 'baseAccount') ||
            config.connectors.find(c => c.type === 'coinbaseWallet') ||
            config.connectors.find(c => c.name === 'MetaMask') ||
            config.connectors.find(c => c.type === 'injected') ||
            config.connectors.find(c => c.type !== 'farcasterFrame') ||
            config.connectors[0];
          console.log('Using connector:', connector?.name, connector?.type);

          if (connector) {
            connect({ connector });
          } else {
            console.error('No suitable connector found');
          }
        }}
        className='px-4 py-2'
      >
        Connect Wallet
      </Button>
      {connectError && (
        <div className='text-red-500 text-xs mt-1'>
          Error: {connectError.message}
        </div>
      )}
    </div>
  );
}

export function FullWalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { connect } = useConnect();
  const [baseSignedIn, setBaseSignedIn] = useState(false);
  const [baseAccountSDK, setBaseAccountSDK] = useState<unknown>(null);
  const [baseName, setBaseName] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Base Account SDK only on client side
    if (typeof window !== 'undefined') {
      import('@base-org/account')
        .then(({ createBaseAccountSDK }) => {
          const sdk = createBaseAccountSDK({
            appName: METADATA.name,
            appLogoUrl: METADATA.iconImageUrl,
          });
          setBaseAccountSDK(sdk);
        })
        .catch(error => {
          console.warn('Failed to load Base Account SDK:', error);
        });
    }
  }, []);

  // Resolve Base name when address changes
  useEffect(() => {
    const resolveNames = async () => {
      if (!address) {
        setBaseName(null);
        return;
      }

      try {
        // Get both ENS and Base names using OnchainKit
        const [ensNames, baseNames] = await Promise.all([
          getNames({ addresses: [address] }), // ENS names
          getNames({ addresses: [address], chain: base }), // Base names
        ]);

        // Prioritize Base name over ENS name
        const baseNameResult = baseNames[0];
        const ensNameResult = ensNames[0];

        if (baseNameResult && typeof baseNameResult === 'string') {
          setBaseName(baseNameResult);
        } else if (ensNameResult && typeof ensNameResult === 'string') {
          setBaseName(ensNameResult);
        } else {
          setBaseName(null);
        }
      } catch (error) {
        console.log('Could not resolve names:', error);
        setBaseName(null);
      }
    };

    resolveNames();
  }, [address]);

  const handleBaseSignIn = async () => {
    if (!baseAccountSDK) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (baseAccountSDK as any)
        .getProvider()
        .request({ method: 'wallet_connect' });
      setBaseSignedIn(true);
    } catch (error) {
      console.error('Base sign in failed:', error);
    }
  };

  return (
    <>
      <div className='mb-4'>
        <Button
          onClick={() => {
            if (isConnected) {
              disconnect();
            } else {
              // Try to connect with Base Account first (best for Base App), then Coinbase Wallet, then MetaMask
              const connector =
                config.connectors.find(c => c.type === 'baseAccount') ||
                config.connectors.find(c => c.type === 'coinbaseWallet') ||
                config.connectors.find(c => c.name === 'MetaMask') ||
                config.connectors.find(c => c.type === 'injected') ||
                config.connectors.find(c => c.type !== 'farcasterFrame') ||
                config.connectors[0];
              connect({ connector });
            }
          }}
          className='w-full'
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>

      {/* Base Account Sign In Button */}
      {baseAccountSDK && (
        <div className='mb-4'>
          <SignInWithBaseButton
            align='center'
            variant='solid'
            colorScheme='light'
            onClick={handleBaseSignIn}
          />
          {baseSignedIn && (
            <div className='mt-2 text-center text-sm text-green-600'>
              ✅ Connected to Base Account
            </div>
          )}
        </div>
      )}

      {isConnected && address && chainId && (
        <div className='mt-4 p-4 bg-white border border-border rounded-xl'>
          <div className='flex justify-between items-center text-sm'>
            <div>
              <span className='text-muted-foreground'>Identity:</span>
              <div className='font-mono text-foreground mt-1'>
                {baseName || `${address.slice(0, 6)}...${address.slice(-4)}`}
              </div>
            </div>
            <div className='text-right'>
              <span className='text-muted-foreground'>Chain:</span>
              <div className='font-mono text-foreground mt-1'>{chainId}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SignMessage() {
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const {
    signMessage,
    data: signature,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const handleSignMessage = useCallback(async (): Promise<void> => {
    if (!isConnected) {
      const connector =
        config.connectors.find(c => c.type === 'baseAccount') ||
        config.connectors.find(c => c.type === 'coinbaseWallet') ||
        config.connectors.find(c => c.name === 'MetaMask') ||
        config.connectors.find(c => c.type === 'injected') ||
        config.connectors.find(c => c.type !== 'farcasterFrame') ||
        config.connectors[0];
      await connectAsync({
        chainId: base.id,
        connector,
      });
    }

    signMessage({ message: 'Hello from HopeChain!' });
  }, [connectAsync, isConnected, signMessage]);

  return (
    <>
      <Button
        onClick={handleSignMessage}
        disabled={isSignPending}
        className='w-full'
      >
        {isSignPending ? 'Signing...' : 'Sign Message'}
      </Button>
      {isSignError && renderError(signError)}
      {signature && (
        <div className='mt-2 p-2 bg-gray-100 rounded text-xs'>
          <div className='text-gray-600 mb-1'>Response</div>
          <div className='text-green-600 font-mono break-all'>{signature}</div>
        </div>
      )}
    </>
  );
}

export function SignSiweMessage() {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const chainId = useChainId();
  const {
    signMessage,
    data: signature,
    error: signError,
    isError: isSignError,
    isPending: isSignPending,
  } = useSignMessage();

  const handleSignSiweMessage = useCallback(async (): Promise<void> => {
    if (!isConnected || !address) {
      const connector =
        config.connectors.find(c => c.type === 'baseAccount') ||
        config.connectors.find(c => c.type === 'coinbaseWallet') ||
        config.connectors.find(c => c.name === 'MetaMask') ||
        config.connectors.find(c => c.type === 'injected') ||
        config.connectors.find(c => c.type !== 'farcasterFrame') ||
        config.connectors[0];
      await connectAsync({
        chainId: base.id,
        connector,
      });
      return;
    }

    const siweMessage = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum to HopeChain.',
      uri: window.location.origin,
      version: '1',
      chainId: chainId || base.id,
      nonce: Math.random().toString(36).substring(2, 15),
    });

    signMessage({ message: siweMessage.prepareMessage() });
  }, [connectAsync, isConnected, address, chainId, signMessage]);

  return (
    <>
      <Button
        onClick={handleSignSiweMessage}
        disabled={isSignPending}
        className='w-full'
      >
        {isSignPending ? 'Signing...' : 'Sign Message (SIWE)'}
      </Button>
      {isSignError && renderError(signError)}
      {signature && (
        <div className='mt-2 p-2 bg-gray-100 rounded text-xs'>
          <div className='text-gray-600 mb-1'>Response</div>
          <div className='text-green-600 font-mono break-all'>{signature}</div>
        </div>
      )}
    </>
  );
}

export function SendEth() {
  const { isConnected } = useAccount();
  const {
    sendTransaction,
    data,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const handleSend = useCallback((): void => {
    sendTransaction({
      to: RECIPIENT_ADDRESS,
      value: BigInt(1),
    });
  }, [sendTransaction]);

  return (
    <>
      <Button
        onClick={handleSend}
        disabled={!isConnected || isSendTxPending}
        className='w-full'
      >
        {isSendTxPending ? 'Sending...' : 'Send Transaction (ETH)'}
      </Button>
      {isSendTxError && renderError(sendTxError)}
      {data && (
        <div className='mt-2 p-2 bg-gray-100 rounded text-xs'>
          <div className='text-gray-600 mb-1'>Response</div>
          <div className='text-green-600 font-mono break-all'>
            Hash: {data.slice(0, 6)}...{data.slice(-4)}
          </div>
          <div className='text-green-600 font-mono'>
            Status:{' '}
            {isConfirming
              ? 'Confirming...'
              : isConfirmed
                ? 'Confirmed!'
                : 'Pending'}
          </div>
        </div>
      )}
    </>
  );
}

export function SignTypedData() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const {
    signTypedData,
    error: signTypedError,
    isError: isSignTypedError,
    isPending: isSignTypedPending,
  } = useSignTypedData();

  const signTyped = useCallback((): void => {
    signTypedData({
      domain: {
        name: 'HopeChain',
        version: '1',
        chainId,
      },
      types: {
        Message: [{ name: 'content', type: 'string' }],
      },
      message: {
        content: 'Hello from HopeChain!',
      },
      primaryType: 'Message',
    });
  }, [chainId, signTypedData]);

  return (
    <>
      <Button
        onClick={signTyped}
        disabled={!isConnected || isSignTypedPending}
        className='w-full'
      >
        {isSignTypedPending ? 'Signing...' : 'Sign Typed Data'}
      </Button>
      {isSignTypedError && renderError(signTypedError)}
    </>
  );
}

export function SwitchChain() {
  const chainId = useChainId();
  const {
    switchChain,
    error: switchChainError,
    isError: isSwitchChainError,
    isPending: isSwitchChainPending,
  } = useSwitchChain();

  const handleSwitchChain = useCallback((): void => {
    switchChain({ chainId: chainId === base.id ? baseSepolia.id : base.id });
  }, [switchChain, chainId]);

  return (
    <>
      <Button
        onClick={handleSwitchChain}
        disabled={isSwitchChainPending}
        className='w-full'
      >
        {isSwitchChainPending
          ? 'Switching...'
          : `Switch to ${chainId === base.id ? 'Optimism' : 'Base'}`}
      </Button>
      {isSwitchChainError && renderError(switchChainError)}
    </>
  );
}
