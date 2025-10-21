# Verify with Hardhat

{% hint style="info" %}
Make sure you've updated to [**@nomicfoundation/hardhat-verify@^2.0.14**](https://www.npmjs.com/package/@nomicfoundation/hardhat-verify), see migrating notes if you have an existing project
{% endhint %}

[**Hardhat**](https://hardhat.org/) is a smart contracts development tool, perfect if you're familiar with Javascript/Typescript.&#x20;

If you've yet to setup Hardhat, here's the [**official guide**](https://hardhat.org/tutorial/creating-a-new-hardhat-project)**,** the following steps are to setup the verification plugin.

## Install

Via npm

```bash
npm i @nomicfoundation/hardhat-verify
```

## Config

In `hardhat.config.ts`, import the plugin

```ts
import '@nomicfoundation/hardhat-verify';
```

Add your Etherscan key

```javascript
config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: `https://1rpc.io/sepolia`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: 'YourEtherscanApiKey',
  },
};
```

## Deploy and Verify

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network sepolia --verify
```

## Verify an Existing Contract

```bash
npx hardhat verify --network sepolia 0xdCBdBAA8404554502B433106e62728B659aCfE3b
```

## Custom Chains&#x20;

For super new Etherscan based explorers that are not supported by Hardhat yet, you can add them as a `customChain` in `hardhat.config.ts` :sparkles:

```json
etherscan: {
    apiKey: "YourEtherscanApiKey",
    customChains: [
    {
      network: "sonic",
      chainId: 146,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api",
        browserURL: "https://sonicscan.org"
      }
    },
    {
      network: "katana",
      chainId: 146,
      urls: {
        apiURL: "https://api.etherscan.io/v2/api",
        browserURL: "https://sonicscan.org"
      }
    }
  ]
}
```

## Migrating from V1

{% hint style="warning" %}
API keys from any other explorer (such as BscScan/Basescan/Arbiscan) have been deprecated :warning:
{% endhint %}

This change largely affects the `hardhat.config.ts` file — good riddance to the long `customChains` entries for each explorer.

Update your config to a single Etherscan `apiKey` entry as per above.

> _This open source integration was shipped by_ [**_@antico5_**](https://github.com/antico5) _and the Hardhat team_ :raised_hands:
