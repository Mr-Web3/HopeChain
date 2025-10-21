// FILE: scripts/smoke.ts
import { network } from 'hardhat';
import * as dotenv from 'dotenv';
const { ethers } = require('hardhat');

// Load environment variables
dotenv.config();

async function main() {
  const raffle = await ethers.getContract('NFTRaffleVRF');
  const [creator, buyer] = await ethers.getSigners();

  // Validate required environment variables
  if (!process.env.NFT || !process.env.NFT_TOKEN_ID) {
    throw new Error(
      'Missing NFT environment variables. Please check your .env file.'
    );
  }

  // Example params (adjust to your NFT + USDC + times)
  const nftAddr = process.env.NFT;
  const tokenId = Number(process.env.NFT_TOKEN_ID);
  const name = 'House Raffle';
  const desc = '3BR Home';
  const img = 'ipfs://…';
  const price = ethers.parseUnits('10', 6); // 10 USDC
  const minT = 1;
  const maxT = 100;
  const maxPer = 10;

  const latest = await ethers.provider.getBlock('latest');
  if (!latest) throw new Error('no block');
  const now = latest.timestamp;
  const start = BigInt(now + 5);
  const end = BigInt(now + 3600);

  // Approve NFT to raffle, then create
  const raffleAddr = await raffle.getAddress();
  const nft = await ethers.getContractAt('IERC721', nftAddr, creator);
  await (await nft.approve(raffleAddr, tokenId)).wait();

  await (
    await raffle
      .connect(creator)
      .createRaffle(
        nftAddr,
        tokenId,
        name,
        desc,
        img,
        price,
        minT,
        maxT,
        maxPer,
        start,
        end
      )
  ).wait();

  // Get last created raffle id directly from storage
  const raffleId = (await raffle.nextRaffleId()) - 1n;
  console.log('raffleId:', raffleId.toString());

  // Buyer approves USDC and buys 2 tickets
  const usdc = await ethers.getContractAt('IERC20', process.env.USDC!, buyer);
  await (await usdc.approve(raffleAddr, price * 2n)).wait();
  await (await raffle.connect(buyer).buyTickets(raffleId, 2)).wait();

  // LOCAL ONLY: Fast-forward time to end then draw
  await network.provider.send('evm_increaseTime', [4000]);
  await network.provider.send('evm_mine');

  await (await raffle.drawWinner(raffleId)).wait();
  console.log('drawWinner called — wait for Gelato VRF to fulfill on testnet.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
