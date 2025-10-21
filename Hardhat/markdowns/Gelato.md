# Deploy your contract inheriting Gelato VRF

<Note>
  Watch Now: Learn more by watching our video, [Gelato VRF Walkthrough](https://youtu.be/cUPjQYoH2OE), now available on YouTube.
</Note>

In order to get your VRF up and running you will need to first make your contract VRF Compatible.

## Step 1: Set Up Your Development Environment

Ensure you have either [Foundry](https://book.getfoundry.sh/getting-started/installation) or [Hardhat](https://hardhat.org/) set up in your development environment.

## Step 2: Install the Gelato VRF Contracts

Depending on your environment, use the following commands to import the Gelato VRF contracts:

### For Hardhat users:

1. Clone the repo [here](https://github.com/gelatodigital/vrf-contracts)
2. Install dependencies: `yarn install`
3. Fill in `.env` with variables in `.env.example`

### For Foundry users:

```bash
forge install gelatodigital/vrf-contracts --no-commit
```

## Step 3: Inherit [_GelatoVRFConsumerBase_](https://github.com/gelatodigital/vrf-contracts/blob/main/contracts/GelatoVRFConsumerBase.sol) Contract

The recommended approach to integrate Gelato VRF is by inheriting from the `GelatoVRFConsumerBase` smart contract. Here's a simple example to help you set it up:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {GelatoVRFConsumerBase} from "./GelatoVRFConsumerBase.sol";

contract YourContract is GelatoVRFConsumerBase {
    // Your contract's code goes here
}
```

<Note>
  ### Understanding Gas Tank

Before we dive into requesting randomness, it's crucial to understand the role of Gas Tank in using Gelato VRF. The Gelato VRF services necessitate that your Gelato balance is sufficiently funded. This balance caters to Gas fees and rewards Gelato Nodes for their computational tasks. For details about costs and funding your account, do visit our [Gas Tank documentation](/Paymaster-&-Bundler/GasTank/Introduction).

It's important to remember that the current Gas Tank system does not support withdrawals after depositing funds. Ensure to deposit only the amount you plan to utilize for Gelato VRF operations.
</Note>

## Step 4: Request Randomness

To request randomness, call the `_requestRandomness()` function. You should protect the call since it will take from your Gas Tank. The data argument will be passed back to you by the W3F.

```solidity
function requestRandomness(bytes memory data) external {
    require(msg.sender == ...);
    uint64 requestId = _requestRandomness(data);
}
```

## Step 5: Implement the Callback function

Finally, implement the callback function.

```solidity
function _fulfillRandomness(
    bytes32 randomness,
    uint64 requestId,
    bytes memory data,
) internal override {
}
```

<Check>
  ### Best Practices for VRF Fulfillment Handlers

When integrating VRF (Verifiable Random Function) into your smart contracts, it is crucial to manage gas usage effectively to ensure reliable execution. Here are two key practices to follow:

1. **Monitor Gas Limits**: Always ensure that the gas usage of your VRF fulfillment handler does not exceed the maximum block gas limit. If the handler requires more gas than the block limit allows, the transaction will revert, leading to failed executions.

2. **Cap Dynamic Actions**: If your VRF usage involves a dynamic number of actions—where the actions could increase the gas used by the fulfillment transaction—it is advisable to set a cap on the number of actions. This will prevent the transaction from becoming too gas-intensive and ensure it remains below the block gas limit, guaranteeing successful execution.
   </Check>

## Step 6: Pass dedicated msg.sender

When you're ready to deploy your Gelato VRF-compatible contract, an important step is to include the dedicated msg.sender as a constructor parameter. This ensures that your contract is set up to work with the correct operator for fulfilling the randomness requests. It's crucial for ensuring that only authorized requests are processed.

<Note>
  Before deploying, visit the [Gelato app](https://app.gelato.cloud) here. You will find the specific dedicated msg.sender address assigned for your deployer address. This address is crucial for the security and proper functioning of your VRF requests. Learn more about it at [Dedicated msg.sender](/Web3-Functions/Security-Considerations/Dedicated-msg-sender)
</Note>

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {GelatoVRFConsumerBase} from "./GelatoVRFConsumerBase.sol";

contract YourContract is GelatoVRFConsumerBase {
    constructor(address operator)
        GelatoVRFConsumerBase(operator) {
        // Additional initializations
    }

    // The rest of your contract code
}
```

And once you have your contract ready & deployed, grab the address and [Deploy your VRF instance](/VRF/How-To-Guides/Create-a-VRF-Task).
