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
    address public vault; // Address of the donation vault contract
    uint256 public nextId; // TokenId (example (1))
    string public baseURI; // SBT image URI from IPFS

    struct DonorData {
        uint256 totalDonated; // Tracks each donors total donated
        uint256 donationCount; // Tracks each donors donation count how many times they donated
        uint256 lastDonation; // Tracks the last time the user donated
        uint256 tokenId; // tokenId
    }

    mapping(address => DonorData) public donors; // Mapping that returns the addresses of the Donor's data
    mapping(address => bool) public hasMinted; // Mapping that returns the address checks if they have minted with a (bool(true or false))

    event VaultUpdated(address indexed newVault); // Event emits when the Donation vault contracts address is updated
    event BaseURIUpdated(string newURI); // Event emits when the BaseUri is updated
    event DonorUpdated(address indexed donor, uint256 totalDonated, uint256 count, uint256 lastDonation); // Event emits when tokens are recovered
    event TokensRecovered(address indexed token, uint256 amount); // Event emits when tokens are recovered
    event ETHRecovered(uint256 amount); // Event emits when ETH is recovered from this contract

    // Modifier onlyVault can make changes to this contract on admin functions only which is eqaul to the msg.sender = deployer of this contract.
    modifier onlyVault() {
        require(msg.sender == vault, "Not vault");
        _;
    }
    // Constructor argument which takes the (baseUri) that is stored onchin using string memory, the constructor is also setting the ERC721 contracts
    // Name & Symbol.
    constructor(string memory _baseURI)
        ERC721("HopeChain Donor Badge", "HOPE")
    {
        baseURI = _baseURI;
    }
    // This function allows onlyOwner to set the donationvault.sol contracts addrss & requires that the addres can not be zero.
    function setVault(address _vault) external onlyOwner nonReentrant {
        require(_vault != address(0), "Invalid vault");
        vault = _vault;
        emit VaultUpdated(_vault);
    }
    // This function allows the onlyOwner to set a new baseUri which should be set to match our frontend API (https://hope-chain-five.vercel.app/api/metadata).
    function setBaseURI(string memory _uri) external onlyOwner nonReentrant {
        baseURI = _uri;
        emit BaseURIUpdated(_uri);
    }
    // This function can only be called by the onlyVault which is = to the deployer or a specific set address & == msg.sender.
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
    // This public function returns the tokenUri specific to each donor (example (TokenId 1, 2, 3, 4) ).
    function tokenURIForDonor(address donor) public view returns (string memory) {
        // Example: if baseURI = "https://api.hopechain.io/metadata"
        // returns "https://api.hopechain.io/metadata/0xABC123..."
        return string(abi.encodePacked(baseURI, "/", toAsciiString(donor)));
    }
    // This function converts strings into Ascii & stores them onchain using the key tag (memory) using integers (uint256 to unit8).
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
    // This function can only be used interanlly buy the DonationSBT.sol contract and can only be called by this contract used in the function toAsciiString.
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    /* -------- Soulbound Enforcement -------- */
    //  This function is only used interanlly on this contract that checks before a transfer is made the following values are assigned
    // (address, the tokenId, and the batchSize). It also requires that the address its being sent from & sent to can not be zero.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal override
    {
        require(from == address(0) || to == address(0), "Soulbound");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /* -------- Recovery Functions -------- */
    // This function allows the onlyOwner to recover any ERC20 tokens sent to this contract arguments are (address of the ERC20 token, & the amount) make
    // sure that you know how many decimals the token uses to set the correct values when withdrawing to prevent transaction failure.
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        IERC20(tokenAddress).transfer(owner(), amount);
        emit TokensRecovered(tokenAddress, amount);
    }
    // This function allows onlyOwner to recover ETH sent to this contract the only input argemunt is the vlaue = amount, then it does require the
    // transaction (bool) to = true which equals success. If the transaction fails and returns false the entire transaction will revert.
    function recoverETH(uint256 amount) external onlyOwner nonReentrant {
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "ETH transfer failed");
        emit ETHRecovered(amount);
    }

    receive() external payable {}
}
