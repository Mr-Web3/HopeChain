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
 * @title MockMorphoVault
 * @notice A lightweight ERC4626-style vault used for testing DonationVault yield flow.
 *         Deposits USDC, mints vault shares, and simulates yield growth by increasing
 *         totalAssets over time or via manual "simulateYield" calls.
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MockMorphoVault is ERC20, Ownable, ReentrancyGuard {
    IERC20 public immutable asset; // We are using USDC
    uint256 public totalUnderlying; // Total underlying value

    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares); // Event emit when deposit is made
    event Withdraw(address indexed caller, address indexed receiver, uint256 assets, uint256 shares); // Event emit when withdraw is made
    event TokensRecovered(address indexed token, uint256 amount); // Event emit when tokens are recived ERC20 (USDC)
    event ETHRecovered(uint256 amount); // Event emit when ETH is recovered from this contract

    // Constructor param has one argument the assets address (USDC)
    constructor(address _asset)
        ERC20("MockMorphoVault Share", "mShare")
    {
        asset = IERC20(_asset);
    }
    // Deposit function can be called by anyone, its requires the assets to be greater than 0.
    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        require(assets > 0, "zero amount");
        asset.transferFrom(msg.sender, address(this), assets);
        shares = assets;
        _mint(receiver, shares);
        totalUnderlying += assets;
        emit Deposit(msg.sender, receiver, assets, shares);
    }
    // This function allows the owner of the assets & their shares to withdraw, it requires that the user withdrawing assets are greater than zero
    // requires that the totalUnderlying asseets are greater than or equal to the assets. requires if the msg.sender to check the owner and the allowance
    // then allowed must the greater than or equal to assets.
    function withdraw(uint256 assets, address receiver, address owner)
        external
        returns (uint256 shares)
    {
        require(assets > 0, "zero amount");
        require(totalUnderlying >= assets, "insufficient underlying");
        shares = assets;
        if (msg.sender != owner) {
            uint256 allowed = allowance(owner, msg.sender);
            require(allowed >= shares, "insufficient allowance");
            _approve(owner, msg.sender, allowed - shares);
        }
        _burn(owner, shares);
        totalUnderlying -= assets;
        asset.transfer(receiver, assets);
        emit Withdraw(msg.sender, receiver, assets, shares);
    }
    // This function returns the total value of the underlying assets.
    function totalAssets() external view returns (uint256) {
        return totalUnderlying;
    }
    // This function will simulate the yeild and can only be called by onlyOwner
    function simulateYield(uint256 yieldAmount) external onlyOwner nonReentrant {
        totalUnderlying += yieldAmount;
    }
    // This function can be called by onlyOwner cna mint mock USDC from this address and the amount adding to the overall total underlying value.
    function mintMockUSDC(uint256 amount) external onlyOwner nonReentrant {
        asset.transferFrom(msg.sender, address(this), amount);
        totalUnderlying += amount;
    }

    /// Recover any stray ERC20 or ETH sent here accidentally
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        IERC20(tokenAddress).transfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }
    // This function can be called by onlyOwner which requires the TX to eqaul success, if the TX fails which would eqaul false the TX will revert.
    function recoverETH(uint256 amount) external onlyOwner nonReentrant {
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit ETHRecovered(amount);
    }

    receive() external payable {}
}