import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Generating ABI-encoded constructor arguments...\n');

  // Get configuration from environment variables (same as deployment)
  const usdc = process.env.USDC;
  const feeRecipient = process.env.FEE_RECIPIENT;
  const feeBps = parseInt(process.env.FEE_BPS || '100');
  const gelatoOperator = process.env.GELATO_OPERATOR;
  const royaltyReceiver =
    process.env.ROYALTY_RECEIVER ||
    '0xED0833D71d35F825db85FaC67445ADE1c2C99dfe'; // deployer address
  const royaltyBps = parseInt(process.env.ROYALTY_BPS || '250'); // 2.5% default

  // Validate required environment variables
  if (!usdc || !feeRecipient || !gelatoOperator) {
    throw new Error(
      'Missing required environment variables. Please check your .env file.'
    );
  }

  // RwaAssetNFT constructor arguments
  const rwaAssetNFTArgs = [
    'Rafflemint RWA Asset NFT', // name
    'RMNFT', // symbol
    '0xED0833D71d35F825db85FaC67445ADE1c2C99dfe', // initialMinter (deployer)
    royaltyReceiver, // initialRoyaltyReceiver
    royaltyBps, // initialRoyaltyBps
  ];

  // NFTRaffleVRF constructor arguments
  const nftRaffleVRFArgs = [usdc, feeRecipient, feeBps, gelatoOperator];

  // Encode constructor arguments
  const rwaAssetNFTEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ['string', 'string', 'address', 'address', 'uint96'],
    rwaAssetNFTArgs
  );

  const nftRaffleVRFEncoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'address', 'uint256', 'address'],
    nftRaffleVRFArgs
  );

  console.log('='.repeat(60));
  console.log('RwaAssetNFT Constructor Arguments:');
  console.log('Raw arguments:', JSON.stringify(rwaAssetNFTArgs, null, 2));
  console.log('ABI-encoded:', rwaAssetNFTEncoded);

  console.log('\n' + '='.repeat(60));
  console.log('NFTRaffleVRF Constructor Arguments:');
  console.log('Raw arguments:', JSON.stringify(nftRaffleVRFArgs, null, 2));
  console.log('ABI-encoded:', nftRaffleVRFEncoded);

  console.log('\n' + '='.repeat(60));
  console.log('Contract Addresses:');
  console.log('RwaAssetNFT: 0xfd1b198b844c4260de6323C2508A108371D3a441');
  console.log('NFTRaffleVRF: 0xaE87e6D28726215d365a91f43AFf6Cce706745df');

  console.log('\n' + '='.repeat(60));
  console.log('Manual Verification Commands:');
  console.log('\nFor RwaAssetNFT:');
  console.log(
    `npx hardhat verify --network baseSepolia 0xfd1b198b844c4260de6323C2508A108371D3a441 "Rafflemint RWA Asset NFT" "RMNFT" "0xED0833D71d35F825db85FaC67445ADE1c2C99dfe" "${royaltyReceiver}" ${royaltyBps}`
  );

  console.log('\nFor NFTRaffleVRF:');
  console.log(
    `npx hardhat verify --network baseSepolia 0xaE87e6D28726215d365a91f43AFf6Cce706745df "${usdc}" "${feeRecipient}" ${feeBps} "${gelatoOperator}"`
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
