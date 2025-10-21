// ============================================================================
// File: test/raffle.kyc.spec.ts
import { expect } from 'chai';
const { ethers } = require('hardhat');

const NAME = 'NFTRaffleVRF';
const VERSION = '1';

describe('NFTRaffleVRF - claim-after-KYC', () => {
  it('flows: create -> buy -> draw -> fulfill (requireClaim=true) -> claimPrize', async () => {
    const [owner, creator, buyer, kycSigner, gelatoOperator] =
      await ethers.getSigners();

    // Deploy mocks
    const USDC = await ethers.getContractFactory('USDCMock');
    const usdc = await USDC.deploy();
    await usdc.waitForDeployment();

    const NFT = await ethers.getContractFactory('RwaAssetNFT');
    const nft = await NFT.deploy(
      'RWA',
      'RWA',
      creator.address,
      owner.address,
      0
    );
    await nft.waitForDeployment();

    // Deploy raffle (operator = gelatoOperator)
    const Raffle = await ethers.getContractFactory('NFTRaffleVRF');
    const raffle = await Raffle.deploy(
      await usdc.getAddress(),
      owner.address,
      100,
      gelatoOperator.address
    );
    await raffle.waitForDeployment();

    // KYC signer
    await (await raffle.connect(owner).setKycSigner(kycSigner.address)).wait();

    // Mint NFT to creator, approve raffle
    const tokenURI = 'ipfs://example';
    await (await nft.connect(creator).mintTo(creator.address, tokenURI)).wait();
    const tokenId = 1;
    await (
      await nft.connect(creator).approve(await raffle.getAddress(), tokenId)
    ).wait();

    // Creator creates raffle
    const now = (await ethers.provider.getBlock('latest'))!.timestamp;
    await (
      await raffle
        .connect(creator)
        .createRaffle(
          await nft.getAddress(),
          tokenId,
          'House',
          'Desc',
          'img',
          ethers.parseUnits('10', 6),
          1,
          100,
          10,
          BigInt(now + 1),
          BigInt(now + 3600)
        )
    ).wait();
    const rid = (await raffle.nextRaffleId()) - 1n;

    // Toggle requireClaim = true
    await (await raffle.connect(creator).setRequireClaim(rid, true)).wait();

    // Fund buyer with USDC, approve & buy tickets
    await (await usdc.mint(buyer.address, ethers.parseUnits('1000', 6))).wait();
    await (
      await usdc
        .connect(buyer)
        .approve(await raffle.getAddress(), ethers.parseUnits('1000', 6))
    ).wait();
    await (await raffle.connect(buyer).buyTickets(rid, 2)).wait();

    // Jump time beyond end, then draw
    await ethers.provider.send('evm_increaseTime', [4000]);
    await ethers.provider.send('evm_mine', []);
    const drawTx = await raffle.drawWinner(rid);
    const rc = await drawTx.wait();
    const reqEvt = rc!.logs.find(
      (l: any) => l.fragment?.name === 'RandomnessRequested'
    );
    const requestId = reqEvt?.args?.requestId as bigint;

    // Fulfill from Gelato operator (simulate)
    const randomness = 123456n;
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256'],
      [rid]
    );
    await (
      await raffle
        .connect(gelatoOperator)
        .fulfillRandomness(requestId, randomness, encoded)
    ).wait();

    // NFT NOT transferred yet (requireClaim)
    expect(await nft.ownerOf(tokenId)).to.equal(await raffle.getAddress());

    // Build EIP-712 signature
    const domain = {
      name: NAME,
      version: VERSION,
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
    const value = {
      raffleId: rid,
      winner: buyer.address,
      to: buyer.address,
      deadline,
    };

    const sig = await kycSigner.signTypedData(domain, types, value);

    // Winner claims prize
    await (
      await raffle.connect(buyer).claimPrize(rid, buyer.address, deadline, sig)
    ).wait();
    expect(await nft.ownerOf(tokenId)).to.equal(buyer.address);

    // Re-claim should fail
    await expect(
      raffle.connect(buyer).claimPrize(rid, buyer.address, deadline, sig)
    ).to.be.reverted;
  });

  it('rejects invalid signer / expired deadline', async () => {
    const [owner, creator, buyer, wrongSigner, gelatoOperator] =
      await ethers.getSigners();

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

    await (
      await raffle.connect(owner).setKycSigner(wrongSigner.address)
    ).wait();

    await (
      await (await nft.connect(creator)).mintTo(creator.address, 'ipfs://x')
    ).wait();
    await (
      await nft.connect(creator).approve(await raffle.getAddress(), 1)
    ).wait();

    const now = (await ethers.provider.getBlock('latest'))!.timestamp;
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

    await (await raffle.connect(creator).setRequireClaim(rid, true)).wait();

    await (
      await (await usdc).mint(buyer.address, ethers.parseUnits('100', 6))
    ).wait();
    await (
      await usdc
        .connect(buyer)
        .approve(await raffle.getAddress(), ethers.parseUnits('100', 6))
    ).wait();
    await (await raffle.connect(buyer).buyTickets(rid, 1)).wait();

    await ethers.provider.send('evm_increaseTime', [4000]);
    await ethers.provider.send('evm_mine', []);
    const drawTx = await raffle.drawWinner(rid);
    const rc = await drawTx.wait();
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
        .fulfillRandomness(requestId, 777n, encoded)
    ).wait();

    // Build expired signature from wrong signer
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
      (await ethers.provider.getBlock('latest'))!.timestamp - 1
    ); // expired
    const sig = await wrongSigner.signTypedData(domain, types, {
      raffleId: rid,
      winner: buyer.address,
      to: buyer.address,
      deadline,
    });

    await expect(
      raffle.connect(buyer).claimPrize(rid, buyer.address, deadline, sig)
    ).to.be.reverted;
  });
});
