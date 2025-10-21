# HopeChain Smart Contracts

> **Transparent Giving. Real Healing.** Built on Base Network

This directory contains the smart contracts for HopeChain, a DeFi-powered donation platform that uses yield-generating vaults to create sustainable funding for cancer patients.

## 🏗️ Architecture Overview

HopeChain consists of three main smart contracts:

### 1. **DonationVault.sol** - Core Donation Management

The main contract that handles USDC donations, yield generation, and fund distribution.

**Key Features:**

- Receives USDC donations from users
- Automatically deposits funds into Morpho yield vaults
- Mints Soulbound NFTs (SBTs) for donors
- Allows authorized managers to release funds to patients
- Provides comprehensive analytics and transparency

**Core Functions:**

- `donate(uint256 amount)` - Accept USDC donations
- `releaseToPatient(address patient, uint256 amount)` - Release funds to patients
- `getVaultSummary(address donor)` - Get donor and vault statistics
- `getAllDonors()` - Retrieve list of all donors

### 2. **DonationSBT.sol** - Soulbound Donor Badges

Dynamic Soulbound Tokens that evolve with each donation, serving as proof of contribution.

**Key Features:**

- Non-transferable (soulbound) NFTs
- Dynamic metadata that updates with donation amounts
- One badge per donor address
- Automatic minting on first donation
- Updates on subsequent donations

**Core Functions:**

- `mintOrUpdateBadge(address donor, uint256 amount)` - Mint or update donor badge
- `tokenURIForDonor(address donor)` - Get metadata URI for donor
- `setBaseURI(string memory _uri)` - Update metadata base URI

### 3. **MockMorphoVault.sol** - Yield Generation Simulation

A mock implementation of Morpho Protocol's yield vault for testing and development.

**Key Features:**

- ERC4626-compatible vault interface
- Simulates yield generation
- Used for testing donation flow
- Can be replaced with real Morpho vault in production

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Yarn or npm
- Git

### Installation

1. **Install dependencies:**

```bash
cd Hardhat
yarn install
# or
npm install
```

2. **Set up environment variables:**
   Create a `.env` file in the Hardhat directory:

```bash
# Private key for deployment (without 0x prefix)
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional: Alchemy API key for forking
ALCHEMY_API_KEY=your_alchemy_api_key

# Optional: Gas reporter settings
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

3. **Compile contracts:**

```bash
yarn compile
```

### Deployment

**Deploy to Base Sepolia (Testnet):**

```bash
yarn deploy
# or explicitly
yarn deploy:baseSepolia
```

**Deploy to Base Mainnet:**

```bash
yarn deploy:base
```

**Deploy and verify contracts:**

```bash
yarn deploy:all
```

**Generate new deployment account:**

```bash
yarn generate
```

**Check account balance and details:**

```bash
yarn account
```

### Deployment Process

The deployment script (`00_deploy_your_contracts.ts`) automatically:

1. **Deploys DonationSBT** with temporary metadata URI
2. **Deploys MockMorphoVault** connected to USDC
3. **Deploys DonationVault** as the main contract
4. **Links all contracts** together:
   - Vault → SBT connection
   - SBT → Vault connection
   - Vault → MorphoVault connection
   - Sets manager address
5. **Verifies connectivity** and displays summary

**Post-Deployment Steps:**

1. Update `deployedContracts.ts` with new addresses
2. Test donations on Base Sepolia
3. Update SBT baseURI to your production domain:
   ```bash
   yarn run scripts/fixBaseURI.ts
   ```

### Testing

**Run all tests:**

```bash
yarn test
```

**Run tests with gas reporting:**

```bash
yarn test:gas
```

**Run coverage analysis:**

```bash
yarn test:coverage
```

## 📋 Available Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `yarn compile`            | Compile all smart contracts           |
| `yarn test`               | Run test suite with gas reporting     |
| `yarn test:gas`           | Run tests with detailed gas reporting |
| `yarn test:coverage`      | Run test coverage analysis            |
| `yarn deploy`             | Deploy to Base Sepolia (default)      |
| `yarn deploy:base`        | Deploy to Base Mainnet                |
| `yarn deploy:baseSepolia` | Deploy to Base Sepolia                |
| `yarn verify`             | Verify contracts on Etherscan         |
| `yarn account`            | List deployment account with QR code  |
| `yarn generate`           | Generate new deployment account       |
| `yarn lint`               | Run ESLint                            |
| `yarn format`             | Format code with Prettier             |
| `yarn deploy:all`         | Compile, deploy, and verify contracts |

## 🔧 Contract Configuration

### DonationVault Configuration

After deployment, configure the vault:

1. **Set Manager:**

```solidity
donationVault.setManager(managerAddress);
```

2. **Set SBT Contract:**

```solidity
donationVault.setSBT(sbtAddress);
```

3. **Set Morpho Vault:**

```solidity
donationVault.setMorphoVault(morphoVaultAddress);
```

### DonationSBT Configuration

1. **Set Vault Address:**

```solidity
donationSBT.setVault(donationVaultAddress);
```

2. **Set Base URI:**

```solidity
donationSBT.setBaseURI("https://your-domain.com/api/metadata");
```

## 📊 Contract Analytics

The DonationVault provides comprehensive analytics:

- **Total Donated:** `getTotalDonated()`
- **Yield Earned:** `getYieldEarned()`
- **Total Donors:** `getTotalDonors()`
- **Lives Changed:** `getLivesChanged()`
- **Total Released:** `getTotalReleased()`
- **Vault Balance:** `currentVaultBalance()`
- **Donor List:** `getAllDonors()`

## 🔒 Security Features

- **ReentrancyGuard:** Prevents reentrancy attacks
- **Ownable:** Access control for administrative functions
- **Soulbound NFTs:** Non-transferable donor badges
- **Input Validation:** Comprehensive parameter validation
- **Emergency Recovery:** Functions to recover stuck funds

## 🌐 Network Support

**Primary Networks:**

- **Base Sepolia** (Testnet) - `84532` - Default deployment target
- **Base Mainnet** (Production) - `8453`

**Additional Supported Networks:**

- Ethereum Mainnet - `1`
- Ethereum Sepolia - `11155111`
- Arbitrum - `42161`
- Arbitrum Sepolia - `421614`
- Optimism - `10`
- Optimism Sepolia - `11155420`
- Polygon - `137`
- Polygon Mumbai - `80001`
- Scroll - `534352`
- Scroll Sepolia - `534351`

## 📁 Project Structure

```
Hardhat/
├── contracts/           # Smart contracts
│   ├── DonationVault.sol
│   ├── DonationSBT.sol
│   └── MockMorphoVault.sol
├── deploy/              # Deployment scripts
│   ├── 00_deploy_your_contracts.ts
│   └── 99_generateTsAbis.ts
├── scripts/             # Utility scripts
│   ├── fixBaseURI.ts
│   ├── verify.ts
│   └── ...
├── test/                # Test files
├── deployments/         # Deployment artifacts
└── typechain-types/     # TypeScript bindings
```

## 🔄 Integration with Frontend

The contracts integrate with the Next.js frontend through:

1. **Contract Addresses:** Stored in `../contracts/deployedContracts.ts`
2. **ABI Generation:** Automatically generated TypeScript bindings
3. **Metadata API:** SBT metadata served by frontend API routes

## 🚨 Important Notes

- **Manager Role:** The manager address can release funds to patients
- **Soulbound NFTs:** Donor badges cannot be transferred
- **Yield Generation:** Funds automatically earn yield in Morpho vaults
- **Transparency:** All transactions are publicly verifiable on-chain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or support:

- Create an issue in the repository
- Contact: [@DecentralBros\_](https://x.com/DecentralBros_)
- Website: [decentralbros.io](https://www.decentralbros.io)

---

**Built with ❤️ by Decentral Bros**
