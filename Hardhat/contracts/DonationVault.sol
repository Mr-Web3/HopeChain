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
// SBT Donor Badge Interface
interface IDonationSBT {
    function mintOrUpdateBadge(address donor, uint256 amount) external;
}
// Morpho Mock Vault / Verify these interfaces are correct before main net deployment
interface IMorphoVault {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
    function totalAssets() external view returns (uint256);
}

/* ---------------- Contract ---------------- */

contract DonationVault is Ownable, ReentrancyGuard {
    IERC20 public immutable USDC; // ERC20 USDC Address
    IDonationSBT public SBT; // SBT NFT Address
    IMorphoVault public morphoVault; // Morpho Address

    address public manager; // Manager wallet address

    uint256 public totalDonated; // Total amount donated
    uint256 public totalDonors; // Total amount of donors
    uint256 public totalLivesChanged; // Amount of people funded
    uint256 public totalReleased; // Total released to patients

    mapping(address => uint256) public donorTotal; // Mapping to track the total amount for each donors address
    mapping(address => bool) public hasDonated; // Mapping to track which address has donated using a true or false ( bool )
    address[] private donorList; // Array of private addresss set to a donor list 

    /* ---------------- Events ---------------- */
    event Donated(address indexed donor, uint256 amount, uint256 timestamp); // Donation event
    event Released(address indexed patient, uint256 amount); // Funds released event
    event ManagerUpdated(address indexed newManager); // Event for when the managers address is updated onlyOwner
    event MorphoVaultUpdated(address indexed newVault); // Event for when the Morpho vault address is updated onlyOwner
    event SBTUpdated(address indexed newSBT); // Event for updated address to the DonationSBT.sol contract address onlyOwner
    event TokensRecovered(address indexed token, uint256 amount); // Event for tokens recovered if ERC20 tokens get sent or stuck on the contract onlyOwner
    event ETHRecovered(uint256 amount); // Event to recover sent or stuck ETH on the contract onlyOwner

    /* ---------------- Constructor ---------------- */
    // Constructor argument requires the USDC address to be set upon deployment, this is set in the deployment script. Address can not be ( 0 )
    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        USDC = IERC20(_usdc);
    }

    /* ---------------- Modifiers ---------------- */
    // onlyOwner modifier this is used for only admin functions the contract owner can make changes to
    modifier onlyManager() {
        require(msg.sender == manager, "Not manager");
        _;
    }

    /* ---------------- Owner Config ---------------- */
    // OnlyOwner of the contract can change the manager address that releases the donation funds
    function setManager(address _manager) external onlyOwner nonReentrant {
        require(_manager != address(0), "Invalid manager");
        manager = _manager;
        emit ManagerUpdated(_manager);
    }
    // OnlyOwner can change the SBT donation NFT contract address this is set in a seq on deployment
    function setSBT(address _sbt) external onlyOwner nonReentrant {
        require(_sbt != address(0), "Invalid address");
        SBT = IDonationSBT(_sbt);
        emit SBTUpdated(_sbt);
    }
    // OnlyOwner can change the address of the Morpho Vault
    function setMorphoVault(address _vault) external onlyOwner nonReentrant {
        require(_vault != address(0), "Invalid address");
        morphoVault = IMorphoVault(_vault);
        USDC.approve(_vault, type(uint256).max);
        emit MorphoVaultUpdated(_vault);
    }

    /* ---------------- Donation Flow ---------------- */
    // Public donation function protected against reentrant attacks to protect the public dontation function
    // Requires the amount to be greater than 0, also requires the morpho vault address to be set and can not be zero.
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
    // This is an onlymanager function, this function can only be called from our backend oracle that gets trigged by the manager when funds are approved
    // To be released to a verified patient. It requires the address of the patient & it can not be zero, it also requires the amount to be greater tha
    // Zero  and requires the address of the Morpho Vault and it can not be zero. Only The donation contract can withdraw from the Morpho vault by the manager.
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
    // This functions purpose is called by onlyOwner, it's purpose is to sweep the USDC balance of (this address) the balance of (this address) must be
    // greater than zero & the morpho vault address must not == zero. If all checks pass then then the donationVault.sol contract will sweep itself
    // deposit the USDC it find on its balance & deposit it into the morpho vault adding to the yeild.
    function sweepUSDCToVault() external onlyOwner nonReentrant {
        uint256 balance = USDC.balanceOf(address(this));
        if (balance > 0 && address(morphoVault) != address(0)) {
            morphoVault.deposit(balance, address(this));
        }
    }
    // The recoverERC20 function can be called by onlyOwner this function is designed to withdraw any ERC20 tokens that are sent to this contract that do not
    // belong there. When this function is called it takes two arguments 1: (the address of the ERC20 token, ) 2: (the amount you are trying to withdraw)
    // make sure to take into account the tokens decimals, it could be 6, 8, 9, 10 anything to the EIP standard 18.
    // This function also requires the token address can be zero.
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        require(tokenAddress != address(0), "Invalid token");
        IERC20(tokenAddress).transfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }
    // The function can be called by onlyOwner the purpose it serves is to recover any stuck ETH on this contract takes a (bool for true and false) on
    // the TX: hash & details, requiring the outcome to be true, if it is false then the transaction will revert.
    function recoverETH(uint256 amount) external onlyOwner nonReentrant {
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit ETHRecovered(amount);
    }

    /* ---------------- View / Analytics ---------------- */
    // This function returns the value of the overall total donated in gerneral from all the donors not specific donors (global amount).
    function getTotalDonated() external view returns (uint256) {
        return totalDonated;
    }
    // This function returns the value of the of the morpho vault assets, requiring the address can not be zero. if assets are less than or equal to the
    // total donation it will return 0. This will then return the yeild earned from the value assets - total donations so only showing the yeild returns.
    function getYieldEarned() external view returns (uint256 yield) {
        if (address(morphoVault) == address(0)) return 0;
        uint256 assets = morphoVault.totalAssets();
        if (assets <= totalDonated) return 0;
        yield = assets - totalDonated;
    }
    // This function returns the total amount of donaors in a general total (example (4))
    function getTotalDonors() external view returns (uint256) {
        return totalDonors;
    }
    // This function returns the total amount of how many people have been funded (example (4))
    function getLivesChanged() external view returns (uint256) {
        return totalLivesChanged;
    }
    // This function returns the value of the overall total funds released to patients (example ($200,000))
    function getTotalReleased() external view returns (uint256) {
        return totalReleased;
    }
    // This function returns the amounts for each donor which takes the argument of the donaors (address) which will return the following
    // the totalRasied, the donorsBalance & the vaultBalance. It will also return the totalDonated, the donors total in general how they have donated -
    // example ($5,000) & the current vault balance.
    function getVaultSummary(address donor)
        external
        view
        returns (uint256 totalRaised, uint256 donorBalance, uint256 vaultBalance)
    {
        return (totalDonated, donorTotal[donor], currentVaultBalance());
    }
    // This function returns the value of the vault & requires the morpho vault address can not be set to zero if all passes it will return the underline
    // value of the vault.
    function currentVaultBalance() public view returns (uint256) {
        if (address(morphoVault) == address(0)) return 0;
        return morphoVault.totalAssets();
    }
    // This function will return all the donors in an array list which then can be organized through your frontend logic & code.
    function getAllDonors() external view returns (address[] memory) {
        return donorList;
    }
    // This fucntion will return the count of the all the donors (example (100)).
    function getDonorCount() external view returns (uint256) {
        return donorList.length;
    }

    receive() external payable {}
}
