import { ethers } from 'hardhat';

async function main() {
  const SBT_ADDRESS = '0x38a029E840A5d019effa264167347960DaeF8515';
  const TEST_ADDRESS = '0x56B622940909d6f68e28063879d9a9e56881aB0e'; // Your donor address

  console.log('Testing tokenURI for DonationSBT...');
  console.log('SBT Address:', SBT_ADDRESS);
  console.log('Test Address:', TEST_ADDRESS);

  const sbt = await ethers.getContractAt('DonationSBT', SBT_ADDRESS);

  try {
    const baseURI = await sbt.baseURI();
    console.log('Base URI:', baseURI);

    const tokenURI = await sbt.tokenURIForDonor(TEST_ADDRESS);
    console.log('Token URI for donor:', tokenURI);

    // Test the actual tokenURI if the donor has a token
    const hasMinted = await sbt.hasMinted(TEST_ADDRESS);
    console.log('Has minted:', hasMinted);

    if (hasMinted) {
      const donorData = await sbt.donors(TEST_ADDRESS);
      console.log('Donor data:', {
        totalDonated: ethers.formatUnits(donorData.totalDonated, 6),
        donationCount: donorData.donationCount.toString(),
        tokenId: donorData.tokenId.toString(),
      });

      const actualTokenURI = await sbt.tokenURI(donorData.tokenId);
      console.log('Actual token URI:', actualTokenURI);
    }
  } catch (error) {
    console.error('❌ Error testing tokenURI:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
