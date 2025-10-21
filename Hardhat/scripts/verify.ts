import { ethers } from 'hardhat';
import hre from 'hardhat';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

async function main() {
  console.log('\n=== 🔍 Contract Verification Script (V2 API) ===');

  // Get network name
  const networkName = hre.network.name;
  console.log(`Network: ${networkName}`);

  // Check if ETHERSCAN_API_KEY is set
  if (!process.env.ETHERSCAN_API_KEY) {
    console.error('❌ ETHERSCAN_API_KEY not found in environment variables');
    console.error('Please add ETHERSCAN_API_KEY to your .env file');
    console.error('Get your API key from: https://etherscan.io/apis');
    process.exit(1);
  }

  console.log('✅ Using Etherscan V2 API for verification');

  // Read deployed contract addresses from deployment artifacts
  const deploymentsDir = path.join(__dirname, '..', 'deployments', networkName);

  let donationVaultAddress: string;
  let donationSBTAddress: string;
  let mockMorphoVaultAddress: string;
  let donationVaultData: any;
  let donationSBTData: any;
  let mockMorphoVaultData: any;

  try {
    // Read DonationVault deployment
    const donationVaultPath = path.join(deploymentsDir, 'DonationVault.json');
    donationVaultData = JSON.parse(fs.readFileSync(donationVaultPath, 'utf8'));
    donationVaultAddress = donationVaultData.address;

    // Read DonationSBT deployment
    const donationSBTPath = path.join(deploymentsDir, 'DonationSBT.json');
    donationSBTData = JSON.parse(fs.readFileSync(donationSBTPath, 'utf8'));
    donationSBTAddress = donationSBTData.address;

    // Read MockMorphoVault deployment
    const mockMorphoVaultPath = path.join(
      deploymentsDir,
      'MockMorphoVault.json'
    );
    mockMorphoVaultData = JSON.parse(
      fs.readFileSync(mockMorphoVaultPath, 'utf8')
    );
    mockMorphoVaultAddress = mockMorphoVaultData.address;

    console.log(`✅ Found deployment artifacts for ${networkName}`);
  } catch (error) {
    console.error(`❌ Could not read deployment artifacts for ${networkName}`);
    console.error(
      'Make sure you have deployed contracts first with: yarn deploy'
    );
    throw error;
  }

  // Read constructor arguments from deployment artifacts
  let donationVaultArgs: any[];
  let donationSBTArgs: any[];
  let mockMorphoVaultArgs: any[];

  // Extract constructor arguments from deployment artifacts
  donationVaultArgs = donationVaultData.args || [];
  donationSBTArgs = donationSBTData.args || [];
  mockMorphoVaultArgs = mockMorphoVaultData.args || [];

  if (
    donationVaultArgs.length === 0 ||
    donationSBTArgs.length === 0 ||
    mockMorphoVaultArgs.length === 0
  ) {
    console.error('❌ Constructor arguments not found in deployment artifacts');
    console.error('Falling back to deployment constants...');

    // Fallback to deployment constants (from 00_deploy_your_contracts.ts)
    const USDC_BASE_SEPOLIA = '0x94d07C7Aa3F8910ACeF21300098DA9171d06220C';
    const BASE_URI = 'ipfs://bafybeidonorbadgeuri';

    // Fallback constructor arguments
    donationVaultArgs = [USDC_BASE_SEPOLIA];
    donationSBTArgs = [BASE_URI];
    mockMorphoVaultArgs = [USDC_BASE_SEPOLIA];
  } else {
    console.log(`✅ Found constructor arguments from deployment artifacts`);
  }

  console.log(`DonationVault Address: ${donationVaultAddress}`);
  console.log(`DonationSBT Address: ${donationSBTAddress}`);
  console.log(`MockMorphoVault Address: ${mockMorphoVaultAddress}`);

  // Verify DonationVault
  console.log('\n=== 📋 DonationVault Constructor Arguments ===');
  console.log(`USDC Token: ${donationVaultArgs[0]}`);
  console.log(`Args: [${donationVaultArgs.map(arg => `"${arg}"`).join(', ')}]`);

  try {
    console.log('\n🚀 Verifying DonationVault...');

    await hre.run('verify:verify', {
      address: donationVaultAddress,
      constructorArguments: donationVaultArgs,
    });

    console.log('✅ DonationVault verified successfully!');
    console.log(
      `🔗 View on Base Sepolia: https://sepolia.basescan.org/address/${donationVaultAddress}`
    );
    console.log('🎉 V2 API verification successful!');
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log('✅ DonationVault is already verified!');
      console.log(
        `🔗 View on Base Sepolia: https://sepolia.basescan.org/address/${donationVaultAddress}`
      );
    } else {
      console.error('❌ DonationVault verification failed:', error.message);

      console.log('\n=== 📝 Manual Verification for DonationVault ===');
      console.log('1. Go to https://sepolia.basescan.org/');
      console.log(`2. Search for: ${donationVaultAddress}`);
      console.log("3. Click 'Contract' → 'Verify and Publish'");
      console.log('4. Fill in:');
      console.log(`   - Contract Address: ${donationVaultAddress}`);
      console.log(`   - Compiler: v0.8.28+commit.xxx`);
      console.log('   - License: MIT');
      console.log('   - Constructor Arguments (ABI-encoded):');

      const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address'],
        donationVaultArgs
      );
      console.log(`     ${encodedArgs}`);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Verify DonationSBT
  console.log('=== 📋 DonationSBT Constructor Arguments ===');
  console.log(`Base URI: ${donationSBTArgs[0]}`);
  console.log(`Args: [${donationSBTArgs.map(arg => `"${arg}"`).join(', ')}]`);

  try {
    console.log('\n🚀 Verifying DonationSBT...');

    await hre.run('verify:verify', {
      address: donationSBTAddress,
      constructorArguments: donationSBTArgs,
    });

    console.log('✅ DonationSBT verified successfully!');
    console.log(
      `🔗 View on Base Sepolia: https://sepolia.basescan.org/address/${donationSBTAddress}`
    );
    console.log('🎉 V2 API verification successful!');
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log('✅ DonationSBT is already verified!');
      console.log(
        `🔗 View on Base Sepolia: https://sepolia.basescan.org/address/${donationSBTAddress}`
      );
    } else {
      console.error('❌ DonationSBT verification failed:', error.message);

      console.log('\n=== 📝 Manual Verification for DonationSBT ===');
      console.log('1. Go to https://sepolia.basescan.org/');
      console.log(`2. Search for: ${donationSBTAddress}`);
      console.log("3. Click 'Contract' → 'Verify and Publish'");
      console.log('4. Fill in:');
      console.log(`   - Contract Address: ${donationSBTAddress}`);
      console.log(`   - Compiler: v0.8.28+commit.xxx`);
      console.log('   - License: MIT');
      console.log('   - Constructor Arguments (ABI-encoded):');

      const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['string'],
        donationSBTArgs
      );
      console.log(`     ${encodedArgs}`);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Verify MockMorphoVault
  console.log('=== 📋 MockMorphoVault Constructor Arguments ===');
  console.log(`USDC Token: ${mockMorphoVaultArgs[0]}`);
  console.log(
    `Args: [${mockMorphoVaultArgs.map(arg => `"${arg}"`).join(', ')}]`
  );

  try {
    console.log('\n🚀 Verifying MockMorphoVault...');

    await hre.run('verify:verify', {
      address: mockMorphoVaultAddress,
      constructorArguments: mockMorphoVaultArgs,
    });

    console.log('✅ MockMorphoVault verified successfully!');
    console.log(
      `🔗 View on Base Sepolia: https://sepolia.basescan.org/address/${mockMorphoVaultAddress}`
    );
    console.log('🎉 V2 API verification successful!');
  } catch (error: any) {
    if (error.message.includes('Already Verified')) {
      console.log('✅ MockMorphoVault is already verified!');
      console.log(
        `🔗 View on Base Sepolia: https://sepolia.basescan.org/address/${mockMorphoVaultAddress}`
      );
    } else {
      console.error('❌ MockMorphoVault verification failed:', error.message);

      console.log('\n=== 📝 Manual Verification for MockMorphoVault ===');
      console.log('1. Go to https://sepolia.basescan.org/');
      console.log(`2. Search for: ${mockMorphoVaultAddress}`);
      console.log("3. Click 'Contract' → 'Verify and Publish'");
      console.log('4. Fill in:');
      console.log(`   - Contract Address: ${mockMorphoVaultAddress}`);
      console.log(`   - Compiler: v0.8.28+commit.xxx`);
      console.log('   - License: MIT');
      console.log('   - Constructor Arguments (ABI-encoded):');

      const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address'],
        mockMorphoVaultArgs
      );
      console.log(`     ${encodedArgs}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Verification process completed!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
