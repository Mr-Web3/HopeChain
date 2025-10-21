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
 * @title DonationSBT
 * @notice Dynamic Soulbound NFT — evolves with each donation to show total donations and count.
*/

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DonationSBT is ERC721URIStorage, Ownable, ReentrancyGuard {
    address public vault;
    uint256 public nextId;
    string public baseURI;

    struct DonorData {
        uint256 totalDonated;
        uint256 donationCount;
        uint256 lastDonation;
        uint256 tokenId;
    }

    mapping(address => DonorData) public donors;
    mapping(address => bool) public hasMinted;

    event VaultUpdated(address indexed newVault);
    event BaseURIUpdated(string newURI);
    event DonorUpdated(address indexed donor, uint256 totalDonated, uint256 count, uint256 lastDonation);
    event TokensRecovered(address indexed token, uint256 amount);
    event ETHRecovered(uint256 amount);

    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }

    constructor(string memory _baseURI)
        ERC721("HopeChain Donor Badge", "HOPE")
    {
        baseURI = _baseURI;
    }

    function setVault(address _vault) external onlyOwner nonReentrant {
        require(_vault != address(0), "Invalid vault");
        vault = _vault;
        emit VaultUpdated(_vault);
    }

    function setBaseURI(string memory _uri) external onlyOwner nonReentrant {
        baseURI = _uri;
        emit BaseURIUpdated(_uri);
    }

    function mintOrUpdateBadge(address donor, uint256 amount) external onlyVault nonReentrant {
        if (!hasMinted[donor]) {
            nextId++;
            hasMinted[donor] = true;

            donors[donor] = DonorData({
                totalDonated: amount,
                donationCount: 1,
                lastDonation: block.timestamp,
                tokenId: nextId
            });

            _safeMint(donor, nextId);
            _setTokenURI(nextId, tokenURIForDonor(donor));
        } else {
            DonorData storage info = donors[donor];
            info.totalDonated += amount;
            info.donationCount += 1;
            info.lastDonation = block.timestamp;
            _setTokenURI(info.tokenId, tokenURIForDonor(donor));
        }

        emit DonorUpdated(donor, donors[donor].totalDonated, donors[donor].donationCount, donors[donor].lastDonation);
    }

    function tokenURIForDonor(address donor) public view returns (string memory) {
        // Example: if baseURI = "https://api.hopechain.io/metadata"
        // returns "https://api.hopechain.io/metadata/0xABC123..."
        return string(abi.encodePacked(baseURI, "/", toAsciiString(donor)));
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    /* -------- Soulbound Enforcement -------- */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override
    {
        require(from == address(0) || to == address(0), "Soulbound");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /* -------- Recovery Functions -------- */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        IERC20(tokenAddress).transfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }

    function recoverETH(uint256 amount) external onlyOwner nonReentrant {
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit ETHRecovered(amount);
    }

    receive() external payable {}
}
