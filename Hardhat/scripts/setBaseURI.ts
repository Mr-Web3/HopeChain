import { ethers } from 'hardhat';

async function main() {
  const SBT_ADDRESS = '0x38a029E840A5d019effa264167347960DaeF8515';
  const BASE_URI = 'http://localhost:3000/api/metadata'; // Change to your production URL when ready

  console.log('Setting baseURI for DonationSBT...');
  console.log('SBT Address:', SBT_ADDRESS);
  console.log('Base URI:', BASE_URI);

  const sbt = await ethers.getContractAt('DonationSBT', SBT_ADDRESS);

  try {
    const tx = await sbt.setBaseURI(BASE_URI);
    console.log('Transaction hash:', tx.hash);

    await tx.wait();
    console.log('✅ BaseURI set successfully!');

    // Verify the baseURI was set
    const currentBaseURI = await sbt.baseURI();
    console.log('Current baseURI:', currentBaseURI);
  } catch (error) {
    console.error('❌ Error setting baseURI:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
