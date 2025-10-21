'use client';

import { useState, useEffect, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import deployedContracts from '@/contracts/deployedContracts';

const donationVaultConfig = deployedContracts[84532].DonationVault;
const morphoVaultConfig = deployedContracts[84532].MockMorphoVault;
const donationVaultAddress = donationVaultConfig.address as `0x${string}`;
const morphoVaultAddress = morphoVaultConfig.address as `0x${string}`;

export interface VaultMetrics {
  totalDonated: number;
  yieldEarned: number;
  hopeGivers: number;
  livesChanged: number;
  vaultTotal: number;
  isLoading: boolean;
  error: string | null;
}

export function useVaultMetrics() {
  const [metrics, setMetrics] = useState<VaultMetrics>({
    totalDonated: 0,
    yieldEarned: 0,
    hopeGivers: 0,
    livesChanged: 0,
    vaultTotal: 0,
    isLoading: true,
    error: null,
  });

  // Read total donated
  const { data: totalDonated, refetch: refetchTotalDonated } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getTotalDonated',
    chainId: 84532, // Base Sepolia
    query: {
      refetchInterval: 60000, // Refetch every 60 seconds
      staleTime: 0,
    },
  }) as { data: bigint | undefined; refetch: () => void };

  // Read yield earned
  const { data: yieldEarned, refetch: refetchYieldEarned } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getYieldEarned',
    chainId: 84532, // Base Sepolia
    query: {
      refetchInterval: 10000,
      staleTime: 0,
    },
  }) as { data: bigint | undefined; refetch: () => void };

  // Read total donors
  const { data: hopeGivers, refetch: refetchHopeGivers } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getTotalDonors',
    chainId: 84532, // Base Sepolia
    query: {
      refetchInterval: 10000,
      staleTime: 0,
    },
  }) as { data: bigint | undefined; refetch: () => void };

  // Read lives changed
  const { data: livesChanged, refetch: refetchLivesChanged } = useReadContract({
    address: donationVaultAddress,
    abi: donationVaultConfig.abi,
    functionName: 'getLivesChanged',
    chainId: 84532, // Base Sepolia
    query: {
      refetchInterval: 10000,
      staleTime: 0,
    },
  }) as { data: bigint | undefined; refetch: () => void };

  // Read vault total assets from MockMorphoVault
  const { data: vaultTotalAssets, refetch: refetchVaultTotal } =
    useReadContract({
      address: morphoVaultAddress,
      abi: morphoVaultConfig.abi,
      functionName: 'totalAssets',
      chainId: 84532, // Base Sepolia
      query: {
        refetchInterval: 10000,
        staleTime: 0,
      },
    }) as { data: bigint | undefined; refetch: () => void };

  const updateMetrics = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      totalDonated: totalDonated ? Number(totalDonated) / 1e6 : 0,
      yieldEarned: yieldEarned ? Number(yieldEarned) / 1e6 : 0,
      hopeGivers: hopeGivers ? Number(hopeGivers) : 0,
      livesChanged: livesChanged ? Number(livesChanged) : 0,
      vaultTotal: vaultTotalAssets ? Number(vaultTotalAssets) / 1e6 : 0,
      isLoading: false,
      error: null,
    }));
  }, [totalDonated, yieldEarned, hopeGivers, livesChanged, vaultTotalAssets]);

  useEffect(() => {
    updateMetrics();
  }, [updateMetrics]);

  const refetchAll = useCallback(() => {
    refetchTotalDonated();
    refetchYieldEarned();
    refetchHopeGivers();
    refetchLivesChanged();
    refetchVaultTotal();
  }, [
    refetchTotalDonated,
    refetchYieldEarned,
    refetchHopeGivers,
    refetchLivesChanged,
    refetchVaultTotal,
  ]);

  return {
    ...metrics,
    refetch: refetchAll,
  };
}
