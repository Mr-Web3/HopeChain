# 🚀 Etherscan V2 API Setup Guide

This guide shows you how to set up your Hardhat project to use the new **Etherscan V2 API** for contract verification across 50+ chains with a single API key.

## ✨ V2 API Benefits

- **Single API Key**: Works across 50+ chains (Ethereum, Base, Arbitrum, Optimism, Polygon, etc.)
- **Unified Verification**: No need for multiple explorer API keys
- **Simplified Configuration**: One key to rule them all
- **Future-Proof**: Supports all new chains automatically

## 🔧 Quick Setup

### 1. Get Your Etherscan V2 API Key

1. Go to [Etherscan API Keys](https://etherscan.io/apis)
2. Create an account or sign in
3. Generate a new API key
4. Copy your API key

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit your .env file
nano .env
```

Add your API key to `.env`:

```env
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 3. Deploy and Verify

```bash
# Deploy contracts
yarn deploy

# Verify contracts (uses V2 API automatically)
yarn verify

# Or do both in one command
yarn deploy:all
```

## 📋 Available Commands

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `yarn deploy`          | Deploy to Base Sepolia (default) |
| `yarn verify`          | Verify contracts using V2 API    |
| `yarn deploy:all`      | Deploy + Verify in one command   |
| `yarn deploy:base`     | Deploy to Base Mainnet           |
| `yarn deploy:arbitrum` | Deploy to Arbitrum               |
| `yarn deploy:optimism` | Deploy to Optimism               |
| `yarn deploy:polygon`  | Deploy to Polygon                |

## 🌐 Supported Networks

Your configuration supports these networks with V2 API:

- **Base Sepolia** (Chain ID: 84532) - Default testnet
- **Base Mainnet** (Chain ID: 8453)
- **Arbitrum** (Chain ID: 42161)
- **Arbitrum Sepolia** (Chain ID: 421614)
- **Optimism** (Chain ID: 10)
- **Optimism Sepolia** (Chain ID: 11155420)
- **Polygon** (Chain ID: 137)
- **Polygon Mumbai** (Chain ID: 80001)

## 🔍 How V2 API Works

### Before (V1 - Multiple Keys)

```env
ETHERSCAN_API_KEY=key1
BSCSCAN_API_KEY=key2
ARBISCAN_API_KEY=key3
POLYGONSCAN_API_KEY=key4
```

### After (V2 - Single Key)

```env
ETHERSCAN_API_KEY=your_single_key
```

### Hardhat Configuration

```typescript
etherscan: {
  apiKey: `${etherscanApiKey}`,
  customChains: [
    {
      network: "baseSepolia",
      chainId: 84532,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api",
        browserURL: "https://sepolia.basescan.org"
      }
    }
    // ... more chains
  ]
}
```

## 🛠️ Troubleshooting

### "Invalid API Key" Error

```bash
❌ Invalid API Key (#err2)|BASE1-
```

**Solution**: Make sure you're using an **Etherscan API key**, not a Basescan/Arbiscan key.

1. Get your key from: https://etherscan.io/apis
2. Add it to your `.env` file
3. Restart your terminal

### "Contract Already Verified" Error

```bash
✅ Contract is already verified!
```

**This is normal** - your contract is already verified and working!

### Network Not Supported

If you get network errors, check that your network is in the `customChains` configuration in `hardhat.config.ts`.

## 🎯 Perfect Workflow

### For Development

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your API keys

# 2. Deploy and verify
yarn deploy:all

# 3. Test your contracts
yarn test
```

### For Production

```bash
# Deploy to mainnet
yarn deploy:base

# Verify on mainnet
yarn verify --network base
```

## 📚 Additional Resources

- [Etherscan V2 API Documentation](https://docs.etherscan.io/)
- [Hardhat Verification Guide](https://hardhat.org/hardhat-runner/docs/guides/verifying)
- [Supported Chains](https://docs.etherscan.io/supported-chains)

## 🎉 Success!

Once set up, you can verify contracts on any supported chain with a single command:

```bash
yarn verify --network <any-supported-network>
```

Your contracts will be verified using the V2 API automatically! 🚀
