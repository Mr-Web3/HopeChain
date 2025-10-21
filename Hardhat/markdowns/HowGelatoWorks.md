# How does Gelato VRF work?

Gelato VRF (Verifiable Random Function) provides a unique system offering trustable randomness on EVM-compatible blockchains. But what's the magic behind this reliable randomness? Let's see!

<Tip>
  After reading this page:

- You'll be able to understand the core components of Gelato VRF.
- You'll understand how you can initiate a randomness request.
- You'll be able to navigate the randomness delivery.
- You'll understand how to integrate and utilize Gelato VRF.
  </Tip>

## Core Component

**Drand**: This is the heart of the randomness. Drand is a decentralized randomness beacon, ensuring the unpredictability and unbiased nature of the random numbers provided. To learn more about Drand and how it works, please refer to their [documentation](https://drand.love/docs/overview/#how-drand-works).

## Top level Flow

```
 +------------------------+
 | 1. Contract Deployment |
 +------------------------+
          |
          v
 +-----------------------+
 | 2. Requesting         |
 |    Randomness         |
 +-----------------------+
          |
          v
 +-----------------------+
 | 3. Processing the     |
 |     randomness        |
 |       event           |
 +-----------------------+
          |
          v
 +-----------------------+
 | 4. Randomness Delivery|
 +-----------------------+
```

### 1. Contract Deployment

The smart contract that developers need to interact with is located at [GelatoVRFConsumerBase.sol](https://github.com/gelatodigital/vrf-contracts/blob/main/contracts/GelatoVRFConsumerBase.sol)

This contract serves as an interface to the Gelato VRF system, allowing other smart contracts to request and receive random numbers.

### 2. Requesting Randomness

Inside the `GelatoVRFConsumer` contract, there's an event named `RequestedRandomness`. When a randomness request is made, this event is emitted.

The `RequestedRandomness` event serves as a beacon, signaling the Gelato VRF system about the need for a random number. It contains 2 parameters:

- `round` explicitly signifies which Drand round is targeted to fulfill the randomness,
- `data` offers versatility for developers, it can be used to attach any supplementary information or context about the randomness request.

```solidity
event RequestedRandomness(uint256 round, bytes data);
```

### 3. Processing the Randomness Request

Internally, the system leverages [Web3 functions](/Web3-Functions) to listen for the emitted `RequestedRandomness` event and to fetch the required random number from Drand.

### 4. Delivering Randomness

#### Composable Callback with Arbitary Data

Internally, the system invokes the `fulfillRandomness` function in the requesting contract.

#### Callback Invocation and Data Decoding

The random number (sourced from Drand) is passed as the `randomness` parameter to the function. Additionally, the `data` parameter can carry any supplementary data provided during the original request or by the Gelato VRF.
