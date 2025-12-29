import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log('🚀 Deploying Onchain Cancer Aid Contracts...');

  // ---------------------------------------------------------------------------
  // 1️⃣  Constants
  // ---------------------------------------------------------------------------
  const USDC_BASE_SEPOLIA = '0x94d07C7Aa3F8910ACeF21300098DA9171d06220C'; // Base Sepolia USDC

  // Temporary base URI (for dynamic metadata API, will update post-deploy)
  // Later, you’ll call setBaseURI("https://yourdomain.com/api/metadata")
  const TEMP_BASE_URI =
    'http://localhost:3000/api/metadata';

  const MANAGER_ADDRESS = deployer; // can replace with backend or multisig if needed

  // ---------------------------------------------------------------------------
  // 2️⃣  Deploy DonationSBT (Dynamic Metadata version)
  // ---------------------------------------------------------------------------
  const sbtDeployment = await deploy('DonationSBT', {
    from: deployer,
    args: [TEMP_BASE_URI],
    log: true,
    waitConfirmations: 2,
  });
  log(`✅ DonationSBT deployed at: ${sbtDeployment.address}`);

  // ---------------------------------------------------------------------------
  // 3️⃣  Deploy MockMorphoVault (test yield vault)
  // ---------------------------------------------------------------------------
  const mockVaultDeployment = await deploy('MockMorphoVault', {
    from: deployer,
    args: [USDC_BASE_SEPOLIA],
    log: true,
    waitConfirmations: 2,
  });
  log(`✅ MockMorphoVault deployed at: ${mockVaultDeployment.address}`);

  // ---------------------------------------------------------------------------
  // 4️⃣  Deploy DonationVault (main vault)
  // ---------------------------------------------------------------------------
  const vaultDeployment = await deploy('DonationVault', {
    from: deployer,
    args: [USDC_BASE_SEPOLIA],
    log: true,
    waitConfirmations: 2,
  });
  log(`✅ DonationVault deployed at: ${vaultDeployment.address}`);

  // ---------------------------------------------------------------------------
  // 5️⃣  Link Contracts
  // ---------------------------------------------------------------------------
  const vault = await ethers.getContractAt(
    'DonationVault',
    vaultDeployment.address
  );
  const sbt = await ethers.getContractAt('DonationSBT', sbtDeployment.address);

  try {
    // Add slight delays between txs to prevent nonce collisions
    await new Promise(r => setTimeout(r, 2000));
    await (await vault.setSBT(sbtDeployment.address)).wait();
    log('🔗 Linked: Vault → SBT');

    await new Promise(r => setTimeout(r, 2000));
    await (await sbt.setVault(vaultDeployment.address)).wait();
    log('🔗 Linked: SBT → Vault');

    await new Promise(r => setTimeout(r, 2000));
    await (await vault.setMorphoVault(mockVaultDeployment.address)).wait();
    log('🔗 Linked: Vault → MockMorphoVault');

    await new Promise(r => setTimeout(r, 2000));
    await (await vault.setManager(MANAGER_ADDRESS)).wait();
    log(`👑 Manager set to: ${MANAGER_ADDRESS}`);
  } catch (error) {
    log('⚠️  Contract linking failed (you can retry manually)');
    log(`Error: ${error}`);
  }

  // ---------------------------------------------------------------------------
  // 6️⃣  Verify connectivity
  // ---------------------------------------------------------------------------
  try {
    const assets = await vault.currentVaultBalance();
    log(`🏦 Vault balance check: ${ethers.formatUnits(assets, 6)} USDC`);
  } catch {
    log('⚠️ Could not verify vault balance (likely fine on fresh deploy)');
  }

  // ---------------------------------------------------------------------------
  // 7️⃣  Deployment Summary
  // ---------------------------------------------------------------------------
  log('--------------------------------------');
  log('🎉 Deployment complete!');
  log(`DonationVault:   ${vaultDeployment.address}`);
  log(`DonationSBT:     ${sbtDeployment.address}`);
  log(`MockMorphoVault: ${mockVaultDeployment.address}`);
  log('--------------------------------------');
  log('Next steps:');
  log('  1️⃣  Update deployedContracts.ts with these addresses + new ABIs');
  log('  2️⃣  Run donation tests on Base Sepolia');
  log('  3️⃣  After verifying API route, call:');
  log("         await sbt.setBaseURI('https://yourdomain.com/api/metadata')");
  log('--------------------------------------');
};

export default func;
func.tags = ['DonationSystem'];
