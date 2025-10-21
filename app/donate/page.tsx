'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from 'wagmi';
// import { Heart, RefreshCw } from 'lucide-react'; // Not used directly in this file anymore
import deployedContracts from '../../contracts/deployedContracts';
import toast from 'react-hot-toast';
import { createPublicClient, http, toCoinType } from 'viem';
import { baseSepolia } from 'viem/chains';

// Import our new components
import { DonationCard } from '../components/donate/DonationCard';
import { DonorLeaderboard } from '../components/donate/DonorLeaderboard';
import { NetworkAlert } from '../components/donate/NetworkAlert';
import { SecurityNotice } from '../components/donate/SecurityNotice';
import { UserDonationSummary } from '../components/donate/UserDonationSummary';

// const donationAmounts = [25, 50, 100, 250, 500, 1000]; // Moved to DonationCard component

export default function DonatePage() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: txHash } = useWriteContract();
  const chainId = useChainId();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [donorData, setDonorData] = useState<
    Array<{
      address: string;
      amount: bigint;
      basename?: string;
    }>
  >([]);
  const [isLoadingDonorData, setIsLoadingDonorData] = useState(false);

  // Track last fetched donor list to prevent flicker
  const [lastDonorAddresses, setLastDonorAddresses] = useState<string[]>([]);

  // Helper: shallow compare to prevent unnecessary re-renders
  const arraysAreEqual = (a?: string[], b?: string[]) => {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return a.every((addr, i) => addr.toLowerCase() === b[i].toLowerCase());
  };
  const [currentTransactionHash, setCurrentTransactionHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [lastTransactionAction, setLastTransactionAction] = useState<
    'approval' | 'donation' | null
  >(null);
  const [lastTransactionAmount, setLastTransactionAmount] = useState<
    string | undefined
  >(undefined);

  // Prevent hydration mismatch by only rendering client-side content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Wait for transaction receipt with 2 confirmations
  const {
    data: transactionReceipt,
    isSuccess,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    hash: currentTransactionHash,
    confirmations: 2,
  });

  // Debug transaction receipt status
  console.log('Transaction Receipt Status:', {
    currentTransactionHash,
    transactionReceipt: !!transactionReceipt,
    isSuccess,
    isError,
    error: error?.message,
  });

  // Contract configurations - Using Base Sepolia (84532)
  const donationVaultConfig = deployedContracts[84532].DonationVault;
  const donationVaultAddress = donationVaultConfig.address as `0x${string}`;
  const usdcConfig = deployedContracts[84532].USDC;
  const usdcAddress = usdcConfig.address as `0x${string}`;

  // Debug logging
  console.log('Chain ID:', chainId);
  console.log('Donation Vault Address:', donationVaultAddress);
  console.log('USDC Address:', usdcAddress);
  console.log('Connected Address:', address);

  // Read USDC balance - only when wallet is connected
  const { data: usdcBalance, refetch: refetchUsdcBalance } = useReadContract(
    address
      ? {
          address: usdcAddress,
          abi: usdcConfig.abi,
          functionName: 'balanceOf',
          args: [address],
          query: {
            refetchInterval: 10000, // Refetch every 10 seconds
            staleTime: 0,
          },
        }
      : undefined
  ) as { data: bigint | undefined; refetch: () => void };

  // Read USDC allowance for donation vault - only when wallet is connected
  const { data: allowance, refetch: refetchAllowance } = useReadContract(
    address && usdcAddress
      ? {
          address: usdcAddress,
          abi: usdcConfig.abi,
          functionName: 'allowance',
          args: [address, donationVaultAddress] as const,
          query: {
            refetchInterval: 10000, // Refetch every 10 seconds
            staleTime: 0,
          },
        }
      : undefined
  ) as { data: bigint | undefined; refetch: () => void };

  // Read vault summary - includes totalRaised, donorBalance, vaultBalance
  const {
    data: vaultSummary,
    isLoading: isVaultSummaryLoading,
    refetch: refetchVaultSummary,
  } = useReadContract(
    address
      ? {
          address: donationVaultAddress,
          abi: donationVaultConfig.abi,
          functionName: 'getVaultSummary',
          args: [address],
          query: {
            staleTime: 30000, // 30s stale tolerance
          },
        }
      : undefined
  ) as {
    data: [bigint, bigint, bigint] | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  // Read vault balance - fallback for when no wallet is connected
  const {
    data: vaultBalance,
    isLoading: isVaultBalanceLoading,
    refetch: refetchVaultBalance,
  } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'currentVaultBalance',
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
      staleTime: 0,
    },
  }) as { data: bigint | undefined; isLoading: boolean; refetch: () => void };

  // Read all donors list
  const { data: allDonors, refetch: refetchAllDonors } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getAllDonors',
    query: {
      staleTime: 30000, // 30s stale tolerance
    },
  }) as { data: string[] | undefined; refetch: () => void };

  // Read donor count
  const { data: donorCount, refetch: refetchDonorCount } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getDonorCount',
    query: {
      staleTime: 30000, // 30s stale tolerance
    },
  }) as { data: bigint | undefined; refetch: () => void };

  // Debug logging after data is available
  console.log('USDC Balance:', usdcBalance);
  console.log('Vault Summary:', vaultSummary);
  console.log('Vault Balance:', vaultBalance);
  console.log('All Donors:', allDonors);
  console.log('Donor Count:', donorCount);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  // Create Viem client for basename resolution
  const viemClient = createPublicClient({
    chain: baseSepolia,
    transport: http(
      process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
    ),
  });

  // Single function to fetch donor data (with optional loading state)
  const fetchDonorData = useCallback(
    async (donorAddresses: string[], showLoading = true) => {
      if (donorAddresses.length === 0) return;

      if (showLoading) {
        setIsLoadingDonorData(true);
      }
      console.log('🔍 Fetching donor data...');

      try {
        const donorDataPromises = donorAddresses.map(async donorAddress => {
          try {
            // Get donor amount from contract
            const donorAmount = (await viemClient.readContract({
              address: donationVaultAddress,
              abi: donationVaultConfig.abi,
              functionName: 'donorTotal',
              args: [donorAddress as `0x${string}`],
            })) as unknown as bigint;

            // Try to get basename
            let basename: string | undefined;
            try {
              const ensName = await viemClient.getEnsName({
                address: donorAddress as `0x${string}`,
                coinType: toCoinType(baseSepolia.id),
              });
              basename = ensName || undefined;
            } catch (basenameError) {
              console.log(`No basename for ${donorAddress}:`, basenameError);
            }

            return {
              address: donorAddress,
              amount: donorAmount,
              basename,
            };
          } catch (error) {
            console.error(`Error fetching data for ${donorAddress}:`, error);
            return {
              address: donorAddress,
              amount: BigInt(0),
              basename: undefined,
            };
          }
        });

        const donorData = await Promise.all(donorDataPromises);

        // Sort by donation amount (highest first)
        donorData.sort((a, b) => Number(b.amount - a.amount));

        setDonorData(donorData);
        console.log('✅ Donor data fetched:', donorData);
      } catch (error) {
        console.error('❌ Error fetching donor data:', error);
      } finally {
        if (showLoading) {
          setIsLoadingDonorData(false);
        }
      }
    },
    [donationVaultAddress, donationVaultConfig.abi, viemClient]
  );

  // Function to refresh all contract data
  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all contract data...');
    setIsRefreshing(true);

    try {
      await Promise.all([
        refetchVaultBalance(),
        address ? refetchUsdcBalance() : Promise.resolve(),
        address ? refetchAllowance() : Promise.resolve(),
        address ? refetchVaultSummary() : Promise.resolve(),
        refetchAllDonors(),
        refetchDonorCount(),
      ]);
      console.log('✅ All contract data refreshed');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    address,
    refetchVaultBalance,
    refetchUsdcBalance,
    refetchAllowance,
    refetchVaultSummary,
    refetchAllDonors,
    refetchDonorCount,
  ]);

  // Fetch donors when contract first loads or new addresses appear
  useEffect(() => {
    if (allDonors && allDonors.length > 0) {
      if (!arraysAreEqual(allDonors, lastDonorAddresses)) {
        console.log('🆕 New donors detected, refetching data...');
        setLastDonorAddresses(allDonors);
        fetchDonorData(allDonors, true);
      }
    }
  }, [allDonors, lastDonorAddresses, fetchDonorData]);

  // Periodic silent refresh (every 30s instead of 10s)
  useEffect(() => {
    if (lastDonorAddresses.length > 0) {
      const interval = setInterval(() => {
        console.log('🔄 Silent donor refresh...');
        fetchDonorData(lastDonorAddresses, false);
      }, 30000); // 30s instead of 10s

      return () => clearInterval(interval);
    }
  }, [lastDonorAddresses, fetchDonorData]);

  // Update transaction hash when writeContract is called
  useEffect(() => {
    if (txHash) {
      setCurrentTransactionHash(txHash);
      setIsTransactionPending(true);
      console.log(`🔗 Transaction hash:`, txHash);
      console.log(`🔗 Current transaction action:`, lastTransactionAction);
    }
  }, [txHash, lastTransactionAction]);

  const handleDonation = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check if user is on the correct network
    if (chainId !== 84532) {
      toast.error('Please switch to Base Sepolia network (Chain ID: 84532)');
      return;
    }

    const amount = selectedAmount || parseInt(customAmount) || 0;
    if (amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    // Convert to USDC (6 decimals)
    const usdcAmount = BigInt(amount * 1e6);

    // Check if user has enough USDC
    if (!usdcBalance || usdcBalance < usdcAmount) {
      toast.error(
        `Insufficient USDC balance. You have ${(Number(usdcBalance) / 1e6).toFixed(2)} USDC but need ${amount} USDC`
      );
      return;
    }

    console.log('Starting donation process...', {
      amount,
      usdcAmount: usdcAmount.toString(),
      allowance: allowance?.toString(),
      usdcBalance: usdcBalance?.toString(),
      usdcAddress,
      donationVaultAddress,
      chainId,
    });

    try {
      // Check if we need to approve USDC first
      if (!allowance || allowance < usdcAmount) {
        console.log('Need to approve USDC first...');
        toast.loading('Approving USDC...', { id: 'approval-loading' });

        // Set transaction tracking
        setLastTransactionAction('approval');
        setLastTransactionAmount(amount.toString());

        await writeContract({
          address: usdcAddress,
          abi: usdcConfig.abi,
          functionName: 'approve',
          args: [donationVaultAddress, usdcAmount] as const,
          value: BigInt(0), // Explicitly set value to 0 for ERC20 approval
        });
        return;
      }

      // Make the donation
      console.log('Making donation...');
      toast.loading('Processing donation...', { id: 'donation-loading' });

      // Set transaction tracking
      setLastTransactionAction('donation');
      setLastTransactionAmount(amount.toString());

      await writeContract({
        address: donationVaultAddress,
        abi: donationVaultConfig.abi,
        functionName: 'donate',
        args: [usdcAmount] as const,
        value: BigInt(0), // Explicitly set value to 0 for USDC donation
      });
    } catch (error) {
      console.error('Donation error:', error);
      toast.dismiss(); // Dismiss any loading toasts
      if (
        error instanceof Error &&
        (error.message.includes('User rejected') ||
          error.message.includes('User denied'))
      ) {
        toast.error('Transaction cancelled by user');
      } else {
        toast.error(
          `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      setIsTransactionPending(false);
      setCurrentTransactionHash(undefined);
      setLastTransactionAction(null);
      setLastTransactionAmount(undefined);
    }
  };

  // Separate function to handle just the donation (after approval)
  const handleDonationOnly = useCallback(async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    const amount = selectedAmount || parseInt(customAmount) || 0;
    if (amount <= 0) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    // Convert to USDC (6 decimals)
    const usdcAmount = BigInt(amount * 1e6);

    console.log('Making donation (approval already done)...', {
      amount,
      usdcAmount: usdcAmount.toString(),
    });

    try {
      toast.loading('Processing donation...', { id: 'donation-loading' });

      // Set transaction tracking
      setLastTransactionAction('donation');
      setLastTransactionAmount(amount.toString());

      await writeContract({
        address: donationVaultAddress,
        abi: donationVaultConfig.abi,
        functionName: 'donate',
        args: [usdcAmount] as const,
        value: BigInt(0), // Explicitly set value to 0 for USDC donation
      });
    } catch (error) {
      console.error('Donation error:', error);
      toast.dismiss(); // Dismiss any loading toasts
      if (
        error instanceof Error &&
        (error.message.includes('User rejected') ||
          error.message.includes('User denied'))
      ) {
        toast.error('Transaction cancelled by user');
      } else {
        toast.error(
          `Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      setIsTransactionPending(false);
      setCurrentTransactionHash(undefined);
      setLastTransactionAction(null);
      setLastTransactionAmount(undefined);
    }
  }, [
    isConnected,
    address,
    selectedAmount,
    customAmount,
    writeContract,
    donationVaultAddress,
    donationVaultConfig.abi,
  ]);

  // Handle transaction completion
  useEffect(() => {
    if (isSuccess && currentTransactionHash) {
      console.log(`✅ Transaction confirmed:`, {
        transactionReceipt,
        isSuccess,
      });

      if (lastTransactionAction === 'approval') {
        // Approval confirmed on-chain
        toast.dismiss('approval-loading'); // Clear the approval loading toast
        toast.success('USDC Approved!', { duration: 2000 }); // Show for 2 seconds

        // Refresh data after approval
        refreshAllData();

        // Auto-start donation after approval
        setTimeout(() => {
          const amount = selectedAmount || parseInt(customAmount) || 0;
          if (amount > 0) {
            handleDonationOnly(); // Use the donation-only function
          }
        }, 2000);
      } else if (lastTransactionAction === 'donation') {
        // Donation confirmed on-chain
        toast.dismiss('donation-loading'); // Clear the loading toast

        const amount = lastTransactionAmount || '0';
        toast.success(`Successfully donated $${amount} USDC!`, {
          duration: 4000,
        });

        setSelectedAmount(null);
        setCustomAmount('');

        // Refresh all data after successful donation
        setTimeout(async () => {
          await refreshAllData();
          // Also refresh donor data specifically to ensure it updates (silent)
          setTimeout(() => {
            if (lastDonorAddresses.length > 0) {
              fetchDonorData(lastDonorAddresses, false);
            }
          }, 1000);
        }, 2000);
      }

      // Reset transaction states
      setCurrentTransactionHash(undefined);
      setIsTransactionPending(false);
      setLastTransactionAction(null);
      setLastTransactionAmount(undefined);
    }
  }, [
    isSuccess,
    currentTransactionHash,
    lastTransactionAction,
    lastTransactionAmount,
    selectedAmount,
    customAmount,
    refreshAllData,
    handleDonationOnly,
    transactionReceipt,
    fetchDonorData,
    lastDonorAddresses,
  ]);

  // Handle transaction errors
  useEffect(() => {
    if (isError && currentTransactionHash) {
      console.log(`❌ Transaction failed:`, error);
      toast.dismiss(); // Dismiss any loading toasts
      toast.error(`Transaction failed: ${error?.message || 'Unknown error'}`);

      // Reset transaction states
      setCurrentTransactionHash(undefined);
      setIsTransactionPending(false);
      setLastTransactionAction(null);
      setLastTransactionAmount(undefined);
    }
  }, [isError, currentTransactionHash, error]);

  return (
    <div className='min-h-screen bg-background'>
      <main className='max-w-7xl mx-auto px-6 sm:px-8 py-16 pb-24 md:pb-16'>
        <div className='space-y-8'>
          {/* Network Alert */}
          <NetworkAlert
            chainId={chainId}
            isConnected={isConnected}
            isMounted={isMounted}
          />

          {/* User Donation Summary - Only for connected wallets */}
          {isMounted && isConnected && vaultSummary && usdcBalance && (
            <UserDonationSummary
              vaultSummary={vaultSummary}
              usdcBalance={usdcBalance}
            />
          )}

          {/* Main Donation Card */}
          <DonationCard
            selectedAmount={selectedAmount}
            customAmount={customAmount}
            onAmountSelect={handleAmountSelect}
            onCustomAmountChange={handleCustomAmountChange}
            onDonate={handleDonation}
            isTransactionPending={isTransactionPending}
            isConnected={isConnected}
            isMounted={isMounted}
            vaultSummary={vaultSummary}
            vaultBalance={vaultBalance}
            isVaultBalanceLoading={isVaultBalanceLoading}
            isVaultSummaryLoading={isVaultSummaryLoading}
            isRefreshing={isRefreshing}
            onRefresh={refreshAllData}
            usdcBalance={usdcBalance}
          />

          {/* Donor Leaderboard */}
          <DonorLeaderboard
            donorData={donorData}
            donorCount={donorCount}
            isLoadingDonorData={isLoadingDonorData}
            onRefresh={() => {
              if (lastDonorAddresses.length > 0) {
                fetchDonorData(lastDonorAddresses, false);
              }
            }}
            allDonors={allDonors}
          />

          {/* Security Notice */}
          <SecurityNotice />
        </div>
      </main>
    </div>
  );
}
