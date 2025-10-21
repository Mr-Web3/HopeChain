# HopeChain - Transparent Giving. Real Healing.

> A DeFi-powered donation platform built on Base Network that uses yield-generating vaults to create sustainable funding for cancer patients.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://hope-chain-five.vercel.app)
[![Built on Base](https://img.shields.io/badge/Built%20on-Base-blue?logo=base)](https://base.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

HopeChain is a revolutionary donation platform that combines the transparency of blockchain technology with the power of DeFi yield generation. Every USDC donation is automatically deposited into secure Morpho vaults, where it earns yield and grows over time, creating a sustainable fund for cancer patients.

### Key Features

- **🔄 Yield Generation:** Donations automatically earn interest in Morpho Protocol vaults
- **🎖️ Soulbound Badges:** Dynamic NFTs that evolve with each donation
- **📊 Live Transparency:** Real-time on-chain metrics and donor leaderboards
- **🔒 100% Transparent:** Every transaction is publicly verifiable
- **💎 No Middlemen:** Direct patient funding with zero hidden fees
- **🌐 Multi-Wallet Support:** Coinbase Pay, WalletConnect, MetaMask, and more

## 🏗️ Architecture

### Frontend Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS with custom components
- **Web3:** Wagmi v2 + Viem for blockchain interactions
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion
- **State Management:** React Query (TanStack Query)

### Smart Contracts

- **DonationVault:** Core donation management and yield generation
- **DonationSBT:** Dynamic soulbound donor badges
- **MockMorphoVault:** Yield vault simulation (testnet)

### Network

- **Primary:** Base Network (Ethereum L2)
- **Testnet:** Base Sepolia
- **Token:** USDC (6 decimals)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/hopechain.git
cd hopechain
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:

```bash
# Base Sepolia RPC
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org

# Base Mainnet RPC (optional)
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org

# Coinbase Developer API Key
NEXT_PUBLIC_COINBASE_API_KEY=your_coinbase_api_key

# Neynar API Key (for Farcaster integration)
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key

# App URL (for metadata)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### 🏠 Home Page (`/`)

- Hero section with mission statement
- How it works explanation
- Live transparency dashboard
- Top donor leaderboard
- Personal story and mission

### 💰 Donate Page (`/donate`)

- USDC donation interface
- Real-time vault metrics
- Donor leaderboard
- Transaction status tracking
- Network validation

### 📊 Impact Page (`/impact`)

- Live statistics and metrics
- Patient stories and testimonials
- Research funding information
- Trusted partners showcase

### 👤 Profile Page (`/profile`)

- Personal donation history
- Dynamic badge display
- Donation progress tracking
- Achievement system

### 📝 Apply Page (`/apply`)

- Patient application form
- Document upload system
- Privacy and security notices
- Application status tracking

## 🛠️ Development

### Available Scripts

| Script           | Description               |
| ---------------- | ------------------------- |
| `npm run dev`    | Start development server  |
| `npm run build`  | Build for production      |
| `npm run start`  | Start production server   |
| `npm run lint`   | Run ESLint                |
| `npm run format` | Format code with Prettier |

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── metadata/      # NFT metadata API
│   │   └── notify/        # Notification endpoints
│   ├── components/        # React components
│   │   ├── donate/        # Donation-related components
│   │   ├── profile/       # Profile components
│   │   ├── ui/            # Reusable UI components
│   │   └── wallet/        # Wallet connection components
│   ├── donate/            # Donation page
│   ├── impact/            # Impact page
│   ├── profile/           # Profile page
│   └── apply/             # Application page
├── contracts/             # Deployed contract addresses
├── lib/                   # Utility functions
├── public/                # Static assets
└── utils/                 # Helper utilities
```

### Component Architecture

#### Core Components

- **DonationCard:** Main donation interface
- **DonorLeaderboard:** Live donor rankings
- **DynamicBadge:** Evolving donor NFT display
- **NetworkAlert:** Network validation warnings
- **UserDonationSummary:** Personal donation stats

#### UI Components

- **ThemeToggle:** Dark/light mode switcher
- **ConnectButton:** Wallet connection interface
- **ProgressIndicator:** Loading and progress states
- **PersonalStory:** Mission and story sections

## 🔗 Smart Contract Integration

### Contract Addresses

Contract addresses are automatically generated and stored in `contracts/deployedContracts.ts`:

```typescript
export const deployedContracts = {
  84532: { // Base Sepolia
    DonationVault: {
      address: "0x...",
      abi: [...]
    },
    DonationSBT: {
      address: "0x...",
      abi: [...]
    },
    USDC: {
      address: "0x...",
      abi: [...]
    }
  }
}
```

### Key Functions

- **Donation:** `donate(uint256 amount)`
- **Vault Summary:** `getVaultSummary(address donor)`
- **Donor List:** `getAllDonors()`
- **SBT Minting:** `mintOrUpdateBadge(address donor, uint256 amount)`

## 🎨 Styling & Theming

### Design System

- **Colors:** Custom color palette with dark/light mode support
- **Typography:** Geist font family
- **Spacing:** Tailwind's spacing scale
- **Components:** Radix UI primitives with custom styling

### Theme Support

- Automatic dark/light mode detection
- System preference respect
- Manual theme toggle
- Persistent theme storage

## 📊 Analytics & Monitoring

### On-Chain Metrics

- Total donated amount
- Yield earned from vaults
- Number of unique donors
- Lives changed count
- Vault balance tracking

### Real-Time Updates

- Automatic data refresh every 10 seconds
- Transaction status monitoring
- Donor leaderboard updates
- Vault balance changes

## 🔒 Security Features

### Wallet Security

- Multiple wallet support
- Network validation
- Transaction confirmation
- Error handling and recovery

### Data Protection

- No private key storage
- Secure API endpoints
- Input validation
- XSS protection

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables

Required environment variables for production:

```bash
NEXT_PUBLIC_BASE_SEPOLIA_RPC
NEXT_PUBLIC_COINBASE_API_KEY
NEXT_PUBLIC_APP_URL
```

### Custom Domain

Update the baseURI in your smart contracts to point to your custom domain:

```typescript
// In Hardhat/scripts/fixBaseURI.ts
const BASE_URI = 'https://your-domain.com/api/metadata';
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Type Checking

```bash
npm run type-check
```

## 📈 Performance

### Optimization Features

- Next.js Image optimization
- Automatic code splitting
- Static generation where possible
- Efficient re-rendering with React Query
- Optimized bundle size

### Core Web Vitals

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [GitHub Wiki](https://github.com/your-username/hopechain/wiki)
- **Issues:** [GitHub Issues](https://github.com/your-username/hopechain/issues)
- **Discord:** [Join our community](https://discord.gg/hopechain)
- **Twitter:** [@DecentralBros\_](https://twitter.com/DecentralBros_)

## 🙏 Acknowledgments

- **Base Network** for the L2 infrastructure
- **Morpho Protocol** for yield generation
- **Coinbase** for Web3 platform support
- **OpenZeppelin** for secure smart contract libraries
- **Vercel** for hosting and deployment

---

**Built with ❤️ by [Decentral Bros](https://www.decentralbros.io)**

_Transparent Giving. Real Healing. Built on Base._
