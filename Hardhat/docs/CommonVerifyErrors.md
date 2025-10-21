# Common Verification Errors

### Invalid API Key

> Invalid API Key (#err2)|10

Make sure to use your **Etherscan** API key, and submit verification via the V2 endpoint `https://api.etherscan.io/v2/api?chainid=1`

In [**Foundry**](https://docs.etherscan.io/contract-verification/verify-with-foundry), check that you have updated to the supported version `v1.2.0`

Keys from other explorers such as BscScan/Basescan/Arbiscan have been deprecated.

### Contract Doesn't Match

> "Compiled contract deployment bytecode does NOT match the transaction deployment bytecode"

The submitted source code does not match the contract code deployed on chain.

Common causes include using a different compiler version or enabling optimisation runs.

For an exact match to be found, both **source code** and **compiler settings** specified have to exactly match the deployment conditions, for the same bytecode to be reproduced.

### Solidity Compilation Error

> "Solidity Compilation Error: Identifier not found or not unique"

A compilation issue occured due to syntax errors in your Solidity source code.&#x20;

Consider debugging your contract with any compiler such as [**Remix**](https://remix.ethereum.org/) or [**Hardhat**](https://hardhat.org/) and reference the error from Solidity's [**official documentation**](https://docs.soliditylang.org).&#x20;

### Contract Not Deployed

> "Unable to locate ContractCode at 0x539a277b12a3f6723f4c1769edb11b0be7c214da

The contract has not been deployed at the specific address at the specific chain.

Check the contract address you've deployed, if your contract deployment transaction has succeeded or if the [**chainId**](https://docs.etherscan.io/supported-chains) specified is correct.

### Missing or Invalid Library Names

> "Library was required but suitable match not found"

A [**library**](https://solidity-by-example.org/library/) was used in your contract deployment, but was not specified, misspelt or using the wrong library address.

Double check on your library names ( **case sensitive** such as "PRBMath" ) or ensure that a matching library name and library address is provided.

### Missing Contract Name

> "Unable to locate ContractName , did you specify the correct Contract Name ?"

A match was not found with the name of the contract specified when multiple files are provided.

Ensure that you have provided the correct contract name to be matched against, and making sure you submit the **main contract** name not its dependencies.&#x20;

### No Deployment Bytecode Match Found

> "Compiled contract deployment bytecode does NOT match the transaction deployment bytecode"

The compilation of your submitted source code does not match the deployment bytecode, ie the constructor arguments plus general initialisation code and runtime bytecode.

Similar solution as above, do take into account constructor arguments as well below.

### Missing/Invalid Constructor Arguments

> "Please check if the correct constructor argument was entered"

if your contract utilized the `constructor` keyword, you should provide it in hex format. Otherwise, leave this field empty as it is.&#x20;

You may reference your original deployment's constructor arguments or determine it from the [**end of your compiled bytecode**](https://info.etherscan.com/contract-verification-constructor-arguments/).&#x20;

{% hint style="info" %}
There is an easter egg 🐣 on the `constructorArguements` field spelling, using it as the "correct" spelling may miss your submission!
{% endhint %}

### Mismatched bytecode metadata hash

> "Please check if the correct bytecodehash was specified via standard-json verification."

The [**metadata hash**](https://docs.soliditylang.org/en/v0.8.17/metadata.html#encoding-of-the-metadata-hash-in-the-bytecode) settings of your submitted source code differs from the settings of your original contract deployment, such as being set to `ipfs` or `none`.

Submit your contract verification using the solc json input format, and [**specify the settings**](https://github.com/PaulRBerg/hardhat-template/blob/f6406c4e7c9e23d5169b39fb11d528a975b678e6/hardhat.config.ts#L104) accordingly there.&#x20;

Other submission formats such as single file or multifile **do not support** changing this setting, and will use the compiler defaults.&#x20;

### Similar Match Found

> "This contract already Similar Matches the deployed ByteCode at 0x4200000000000000000000000000000000000042"

This error indicates that the contract has already been verified via [**Similar Match**](https://info.etherscan.com/types-of-contract-verification/) to another contract.&#x20;

Kindly [**reach out**](https://info.etherscan.com/update-on-similar-match-contract-verification/) to us at this point of time to have this updated to Full Match if required.&#x20;

### Unsupported Solc Version

> "Invalid or not supported solc version, see <https://etherscan.io/solcversions> for list"

This error is thrown when you specify to use an invalid or unsupported version of the Solidity Compiler ie. below `v0.4.11-nightly.2017.3.15+`.

Do [**let us know**](https://docs.etherscan.io/support/getting-help) if you need to verify a contract below this supported version such as to prove you deployed the first NFT!

### Source Code Already Verified

> "Source code already verified"

An [**Exact Match**](https://info.etherscan.com/types-of-contract-verification/) has been obtained, get back to having your [**coffee**](https://media.giphy.com/media/11ISwbgCxEzMyY/giphy.gif)!

If you think this might be a mistake, do check if you've submitted verification to the right **explorer/chain**, a contract that is verified on Etherscan is **not automatically verified** on other explorers.&#x20;

### Unsupported File Import Callback

> "Source "@openzeppelin/contracts/ERC20.sol" not found: File import callback not supported"

This error is thrown when contracts reference imports from external sources, such as [**OpenZeppelin**](https://docs.openzeppelin.com/) libraries or Github links. &#x20;

Consider [**flattening**](https://hardhat.org/hardhat-runner/docs/advanced/flattening#flattening-your-contracts) your source code into a single file, or use the Solidity Standard Json Input format that comes with tools such as [**Hardhat**](https://hardhat.org/hardhat-runner/docs/guides/verifying#verifying-your-contracts) to resolve these external imports.

### Invalid chainId

The chain you've specified does not have an Etherscan-like explorer.

Check the chainId used against our [**supported list**](https://docs.etherscan.io/supported-chains).

### Contract Verifies on Another Explorer

Our verification standard is strict, [**reach out**](https://docs.etherscan.io/support/getting-help) regardless and we'll have a look.

### Temporary Error

> "This could be a temporary error, please retry or contact us (Error Code 10001/10002/10003)"

Something went wrong on our end, which could include downtime or [**maintenance**](https://etherscan.freshstatus.io/) windows.&#x20;

Please retry this in a while or [**ping us**](https://docs.etherscan.io/support/getting-help) if this continues to persist!
