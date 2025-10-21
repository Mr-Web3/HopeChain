// SPDX-License-Identifier: MIT

// Website: https://www.decentralbros.io
// Twitter / X: https://x.com/DecentralBros_

//   ____       ____       ____        _____       ____       
// /\  _`\    /\  _`\    /\  _`\     /\  __`\    /\  _`\     
// \ \ \/\ \  \ \ \L\ \  \ \ \L\ \   \ \ \/\ \   \ \,\L\_\   
//  \ \ \ \ \  \ \  _ <'  \ \ ,  /    \ \ \ \ \   \/_\__ \   
//   \ \ \_\ \  \ \ \L\ \  \ \ \\ \    \ \ \_\ \    /\ \L\ \ 
//    \ \____/   \ \____/   \ \_\ \_\   \ \_____\   \ `\____\
//     \/___/     \/___/     \/_/\/ /    \/_____/    \/_____/

// 01000100 01000010 01010010 01001111 01010011
pragma solidity ^0.8.17;

/**
 * @title DonationVault
 * @notice HopeChain Vault – receives USDC donations, deposits into a Morpho yield vault,
 *         mints a soulbound donor badge (SBT) once per donor,
 *         and allows the manager to release funds directly to verified patients.
*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* ---------------- Interfaces ---------------- */

interface IDonationSBT {
    function mintOrUpdateBadge(address donor, uint256 amount) external;
}

interface IMorphoVault {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
    function totalAssets() external view returns (uint256);
}

/* ---------------- Contract ---------------- */

contract DonationVault is Ownable, ReentrancyGuard {
    IERC20 public immutable USDC;
    IDonationSBT public SBT;
    IMorphoVault public morphoVault;

    address public manager;

    uint256 public totalDonated;
    uint256 public totalDonors;
    uint256 public totalLivesChanged;
    uint256 public totalReleased;

    mapping(address => uint256) public donorTotal;
    mapping(address => bool) public hasDonated;
    address[] private donorList;

    /* ---------------- Events ---------------- */
    event Donated(address indexed donor, uint256 amount, uint256 timestamp);
    event Released(address indexed patient, uint256 amount);
    event ManagerUpdated(address indexed newManager);
    event MorphoVaultUpdated(address indexed newVault);
    event SBTUpdated(address indexed newSBT);
    event TokensRecovered(address indexed token, uint256 amount);
    event ETHRecovered(uint256 amount);

    /* ---------------- Constructor ---------------- */
    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        USDC = IERC20(_usdc);
    }

    /* ---------------- Modifiers ---------------- */
    modifier onlyManager() {
        require(msg.sender == manager, "Not manager");
        _;
    }

    /* ---------------- Owner Config ---------------- */

    function setManager(address _manager) external onlyOwner nonReentrant {
        require(_manager != address(0), "Invalid manager");
        manager = _manager;
        emit ManagerUpdated(_manager);
    }

    function setSBT(address _sbt) external onlyOwner nonReentrant {
        require(_sbt != address(0), "Invalid address");
        SBT = IDonationSBT(_sbt);
        emit SBTUpdated(_sbt);
    }

    function setMorphoVault(address _vault) external onlyOwner nonReentrant {
        require(_vault != address(0), "Invalid address");
        morphoVault = IMorphoVault(_vault);
        USDC.approve(_vault, type(uint256).max);
        emit MorphoVaultUpdated(_vault);
    }

    /* ---------------- Donation Flow ---------------- */

    function donate(uint256 amount) external nonReentrant {
        require(amount > 0, "Zero amount");
        require(address(morphoVault) != address(0), "Morpho not set");

        USDC.transferFrom(msg.sender, address(this), amount);
        morphoVault.deposit(amount, address(this));

        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            totalDonors += 1;
            donorList.push(msg.sender);
        }

        donorTotal[msg.sender] += amount;
        totalDonated += amount;

        emit Donated(msg.sender, amount, block.timestamp);

        if (address(SBT) != address(0)) {
            SBT.mintOrUpdateBadge(msg.sender, amount);
        }
    }

    /* ---------------- Manager Actions ---------------- */

    function releaseToPatient(address patient, uint256 amount)
        external
        onlyManager
        nonReentrant
    {
        require(patient != address(0), "Invalid patient");
        require(amount > 0, "Zero amount");
        require(address(morphoVault) != address(0), "Morpho not set");

        morphoVault.withdraw(amount, address(this), address(this));
        USDC.transfer(patient, amount);

        totalLivesChanged += 1;
        totalReleased += amount;

        emit Released(patient, amount);
    }

    /* ---------------- Maintenance ---------------- */

    function sweepUSDCToVault() external onlyOwner nonReentrant {
        uint256 balance = USDC.balanceOf(address(this));
        if (balance > 0 && address(morphoVault) != address(0)) {
            morphoVault.deposit(balance, address(this));
        }
    }

    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        require(tokenAddress != address(0), "Invalid token");
        IERC20(tokenAddress).transfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }

    function recoverETH(uint256 amount) external onlyOwner nonReentrant {
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit ETHRecovered(amount);
    }

    /* ---------------- View / Analytics ---------------- */

    function getTotalDonated() external view returns (uint256) {
        return totalDonated;
    }

    function getYieldEarned() external view returns (uint256 yield) {
        if (address(morphoVault) == address(0)) return 0;
        uint256 assets = morphoVault.totalAssets();
        if (assets <= totalDonated) return 0;
        yield = assets - totalDonated;
    }

    function getTotalDonors() external view returns (uint256) {
        return totalDonors;
    }

    function getLivesChanged() external view returns (uint256) {
        return totalLivesChanged;
    }

    function getTotalReleased() external view returns (uint256) {
        return totalReleased;
    }

    function getVaultSummary(address donor)
        external
        view
        returns (uint256 totalRaised, uint256 donorBalance, uint256 vaultBalance)
    {
        return (totalDonated, donorTotal[donor], currentVaultBalance());
    }

    function currentVaultBalance() public view returns (uint256) {
        if (address(morphoVault) == address(0)) return 0;
        return morphoVault.totalAssets();
    }

    function getAllDonors() external view returns (address[] memory) {
        return donorList;
    }

    function getDonorCount() external view returns (uint256) {
        return donorList.length;
    }

    receive() external payable {}
}
