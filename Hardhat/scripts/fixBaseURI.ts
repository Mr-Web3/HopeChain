import { ethers } from 'hardhat';

async function main() {
  const SBT_ADDRESS = '0x38a029E840A5d019effa264167347960DaeF8515';
  const BASE_URI = 'https://hope-chain-five.vercel.app/api/metadata'; // Vercel deployment URL

  console.log('Fixing baseURI for DonationSBT...');
  console.log('SBT Address:', SBT_ADDRESS);
  console.log('Base URI:', BASE_URI);

  const sbt = await ethers.getContractAt('DonationSBT', SBT_ADDRESS);

  try {
    const tx = await sbt.setBaseURI(BASE_URI);
    console.log('Transaction hash:', tx.hash);

    await tx.wait();
    console.log('✅ BaseURI fixed successfully!');

    // Verify the baseURI was set
    const currentBaseURI = await sbt.baseURI();
    console.log('Current baseURI:', currentBaseURI);

    // Test the tokenURI
    const testAddress = '0x56B622940909d6f68e28063879d9a9e56881aB0e';
    const tokenURI = await sbt.tokenURIForDonor(testAddress);
    console.log('Token URI for donor:', tokenURI);
  } catch (error) {
    console.error('❌ Error fixing baseURI:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
