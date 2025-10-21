import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, formatUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import deployedContracts from '@/contracts/deployedContracts';

const SBT = deployedContracts[84532].DonationSBT;

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
  ),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    if (!address) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    // Normalize address - add 0x prefix if missing
    const normalizedAddress = address.startsWith('0x')
      ? address
      : `0x${address}`;

    if (normalizedAddress.length !== 42) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    console.log('Fetching metadata for address:', normalizedAddress);

    // Check if donor has minted a badge first
    const hasMinted = (await client.readContract({
      address: SBT.address as `0x${string}`,
      abi: SBT.abi,
      functionName: 'hasMinted',
      args: [normalizedAddress as `0x${string}`],
    })) as unknown as boolean;

    if (!hasMinted) {
      return NextResponse.json(
        { error: 'No donor badge for this address' },
        { status: 404 }
      );
    }

    // donors(address) -> (totalDonated, donationCount, lastDonation, tokenId)
    const donorData = (await client.readContract({
      address: SBT.address as `0x${string}`,
      abi: SBT.abi,
      functionName: 'donors',
      args: [normalizedAddress as `0x${string}`],
    })) as unknown as readonly [bigint, bigint, bigint, bigint];

    const [totalDonated, donationCount, lastDonation, tokenId] = donorData;

    console.log('Donor data:', {
      totalDonated: totalDonated.toString(),
      donationCount: donationCount.toString(),
      lastDonation: lastDonation.toString(),
      tokenId: tokenId.toString(),
    });

    // If no token minted yet, return 404 for marketplaces
    if (tokenId === BigInt(0)) {
      return NextResponse.json(
        { error: 'No donor badge for this address' },
        { status: 404 }
      );
    }

    const totalUSDC = Number(formatUnits(totalDonated, 6)).toFixed(2);
    const lastISO =
      Number(lastDonation) > 0
        ? new Date(Number(lastDonation) * 1000).toISOString()
        : null;

    const image =
      'https://red-raw-anteater-260.mypinata.cloud/ipfs/bafybeib26eryikbu6aorkpbirjunxh5s73ywmpuizdf4ye6mapwtup36ye/0.png';

    const metadata = {
      name: `HopeChain Donor Badge #${tokenId.toString()}`,
      description:
        'This dynamic soulbound NFT updates with every donation on Base, This soulbound token is issued to verified donors who contributed to the Onchain Aid.',
      image,
      external_url: 'https://hope-chain-five.vercel.app/impact',
      attributes: [
        { trait_type: 'Total Donated (USDC)', value: totalUSDC },
        { trait_type: 'Total Donations', value: Number(donationCount) },
        ...(lastISO
          ? [{ trait_type: 'Last Donation', value: lastISO.slice(0, 10) }]
          : []),
        { trait_type: 'Token ID', value: tokenId.toString() },
        { trait_type: 'Soulbound', value: 'true' },
      ],
    };

    const res = NextResponse.json(metadata, { status: 200 });
    // Cache: fast responses but allows frequent refresh
    res.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=59'
    );
    return res;
  } catch (e) {
    console.error('metadata error', e);
    console.error('Error details:', {
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
      address: (await params).address,
    });

    // Check if it's a contract function revert error
    if (
      e instanceof Error &&
      e.message.includes('contract function') &&
      e.message.includes('reverted')
    ) {
      return NextResponse.json(
        {
          error:
            'Contract function not available. Please ensure the updated DonationSBT contract is deployed with the donors() function.',
          details:
            'The donors() function may not exist on the currently deployed contract. Please redeploy the contract with the latest version.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch metadata',
        details: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
