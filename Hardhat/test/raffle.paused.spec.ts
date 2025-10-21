// ============================================================================
// File: test/raffle.paused.spec.ts
import { expect } from 'chai';
const { ethers } = require('hardhat');

describe('Paused NFT behavior', () => {
  it('pausing NFT blocks escrow or claim, unpausing resumes', async () => {
    const [owner, creator, buyer, gelatoOperator] = await ethers.getSigners();

    const usdc = await (
      await (await ethers.getContractFactory('USDCMock')).deploy()
    )
      .waitForDeployment()
      .then(d => d);
    const nft = await (
      await (
        await ethers.getContractFactory('RwaAssetNFT')
      ).deploy('RWA', 'RWA', creator.address, owner.address, 0)
    )
      .waitForDeployment()
      .then(d => d);
    const raffle = await (
      await (
        await ethers.getContractFactory('NFTRaffleVRF')
      ).deploy(
        await usdc.getAddress(),
        owner.address,
        100,
        gelatoOperator.address
      )
    )
      .waitForDeployment()
      .then(d => d);

    // Mint & pause
    await (
      await nft.connect(creator).mintTo(creator.address, 'ipfs://x')
    ).wait();
    await (await nft.connect(owner).pause()).wait();

    // Approve raffle
    await (
      await nft.connect(creator).approve(await raffle.getAddress(), 1)
    ).wait();

    const now = (await ethers.provider.getBlock('latest'))!.timestamp;

    // Escrow should fail while paused
    await expect(
      raffle
        .connect(creator)
        .createRaffle(
          await nft.getAddress(),
          1,
          'A',
          'B',
          'C',
          ethers.parseUnits('1', 6),
          1,
          10,
          10,
          BigInt(now + 1),
          BigInt(now + 3600)
        )
    ).to.be.reverted;

    // Unpause -> works
    await (await nft.connect(owner).unpause()).wait();
    await (
      await raffle
        .connect(creator)
        .createRaffle(
          await nft.getAddress(),
          1,
          'A',
          'B',
          'C',
          ethers.parseUnits('1', 6),
          1,
          10,
          10,
          BigInt(now + 1),
          BigInt(now + 3600)
        )
    ).wait();
    const rid = (await raffle.nextRaffleId()) - 1n;

    // Require claim
    await (await raffle.connect(creator).setRequireClaim(rid, true)).wait();

    // Buy ticket
    await (await usdc.mint(buyer.address, ethers.parseUnits('10', 6))).wait();
    await (
      await usdc
        .connect(buyer)
        .approve(await raffle.getAddress(), ethers.parseUnits('10', 6))
    ).wait();
    await (await raffle.connect(buyer).buyTickets(rid, 1)).wait();

    // draw + fulfill (simulate)
    await ethers.provider.send('evm_increaseTime', [4000]);
    await ethers.provider.send('evm_mine', []);
    const rc = await (await raffle.drawWinner(rid)).wait();
    const requestId = rc!.logs.find(
      (l: any) => l.fragment?.name === 'RandomnessRequested'
    ).args.requestId as bigint;
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256'],
      [rid]
    );
    await (
      await raffle
        .connect(gelatoOperator)
        .fulfillRandomness(requestId, 999n, encoded)
    ).wait();

    // Pause NFT -> claim should revert
    await (await nft.connect(owner).pause()).wait();

    // Make a fake signature shortcut (set signer = buyer for this test)
    await (await raffle.connect(owner).setKycSigner(buyer.address)).wait();
    const domain = {
      name: 'NFTRaffleVRF',
      version: '1',
      chainId: (await ethers.provider.getNetwork()).chainId,
      verifyingContract: await raffle.getAddress(),
    };
    const types = {
      Claim: [
        { name: 'raffleId', type: 'uint256' },
        { name: 'winner', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'deadline', type: 'uint256' },
      ],
    };
    const deadline = BigInt(
      (await ethers.provider.getBlock('latest'))!.timestamp + 600
    );
    const sig = await buyer.signTypedData(domain, types, {
      raffleId: rid,
      winner: buyer.address,
      to: buyer.address,
      deadline,
    });

    await expect(
      raffle.connect(buyer).claimPrize(rid, buyer.address, deadline, sig)
    ).to.be.reverted;

    // Unpause -> claim succeeds
    await (await nft.connect(owner).unpause()).wait();
    await (
      await raffle.connect(buyer).claimPrize(rid, buyer.address, deadline, sig)
    ).wait();
    expect(await nft.ownerOf(1)).to.equal(buyer.address);
  });
});
