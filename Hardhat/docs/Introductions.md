# Introduction

{% hint style="success" %}
**Check out the V1 to V2 API Migration Guide** [**here**](https://docs.etherscan.io/etherscan-v2/v2-quickstart)
{% endhint %}

This V2 update is aimed at a single goal, of unifying EVM data across [**50+ chains**](https://docs.etherscan.io/supported-chains). :handshake:

### Why V2

With the rise of multichain apps, many projects' GitHub repositories resemble a ( shortened ) version of this.

```
ETHERSCAN_API_KEY=VZFDUWB3YGQ1YCDKTCU1D6DDSS
BSCSCAN_API_KEY=ZM8ACMJB67C2IXKKBF8URFUNSY
SNOWSCAN_API_KEY=ATJQERBKV1CI3GVKNSE3Q7RGEJ
ARBISCAN_API_KEY=B6SVGA7K3YBJEQ69AFKJF4YHVX
OPTIMISM_API_KEY=66N5FRNV1ZD4I87S7MAHCJVXFJ

ETHERSCAN_API_URL=https://api.etherscan.io/api
BSCSCAN_API_KEY=https://api.bscscan.com/api
SNOWSCAN_API_KEY=https://api.snowscan.xyz/api
ARBISCAN_API_KEY=https://api.arbiscan.io/api
OPTIMISM_API_KEY=https://api-optimistic.etherscan.io/api
```

As support for Etherscan explorers across multiple chains grew, so did the fragmentation of the developer experience.

### Single API Key

You can now query data from any of our [**50+ supported chains**](https://docs.etherscan.io/supported-chains) with a single API key.&#x20;

This includes features like contract verification ✅, fetching transactions across chains 🔵 and more.

To add support for a new chain, simply append its **chain ID** to your array, like this JavaScript ( intern can't get Python installed on Windows )

<pre class="language-javascript"><code class="lang-javascript">const chains = [42161, 8453, 10, 534352, 81457]

for (const chain of chains) {

  // endpoint accepts one chain at a time, loop for all your chains
  const balance = fetch(`https://api.etherscan.io/v2/api?
     chainid=${chain}
     &#x26;module=account
     &#x26;action=balance
     &#x26;address=0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511
     &#x26;tag=latest&#x26;apikey=YourApiKeyToken`)
     
<strong>}
</strong>
</code></pre>

We don't currently support [**all endpoints**](https://docs.etherscan.io/broken-reference) on all chains. Please feel free to [**reach out**](mailto:apisupport@etherscan.io) if you need something specific!
