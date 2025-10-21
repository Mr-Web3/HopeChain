import { createPublicClient, http, toCoinType } from 'viem';
import { base } from 'viem/chains';

// Create a Viem client for basename resolution
// Using a private RPC provider is recommended for ENSIP-19 resolution
const getViemClient = () => {
  // Use mainnet for ENS resolution, but with Base RPC for better performance
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
  
  return createPublicClient({
    chain: base, // Use mainnet for ENS resolution
    transport: http(rpcUrl),
  });
};

/**
 * Resolves the primary ENS name (basename) for an address on Base
 * Uses Viem's getEnsName with the correct coinType for Base
 */
export async function resolveBasename(address: `0x${string}`): Promise<string | null> {
  try {
    console.log(`🔍 Resolving basename for address: ${address}`);
    const client = getViemClient();
    
    const name = await client.getEnsName({
      address,
      coinType: toCoinType(base.id), // Use Base chain ID for coinType
    });
    
    console.log(`✅ Resolved basename: ${name || 'null'} for ${address}`);
    return name;
  } catch (error) {
    console.log(`❌ Could not resolve basename for ${address}:`, error);
    return null;
  }
}

/**
 * Resolves basename for multiple addresses
 */
export async function resolveBasenames(addresses: `0x${string}`[]): Promise<(string | null)[]> {
  try {
    const client = getViemClient();
    
    const names = await Promise.all(
      addresses.map(address => 
        client.getEnsName({
          address,
          coinType: toCoinType(base.id), // Use Base chain ID for coinType
        }).catch(() => null)
      )
    );
    
    return names;
  } catch (error) {
    console.log('Could not resolve basenames:', error);
    return addresses.map(() => null);
  }
}
