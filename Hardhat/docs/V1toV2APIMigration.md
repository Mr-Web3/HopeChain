# V1 to V2 API Migration Guide

{% hint style="warning" %}
Use your **Etherscan API KEY** onl&#x79;**.**
{% endhint %}

### If you're coming from V1

Your base url looks like this

```
https://api.etherscan.io/api
```

Just append V2 to the base url, and a `chainId` parameter

```
https://api.etherscan.io/v2/api?chainid=1
```

### If you're coming from another explorer, Basescan/Arbiscan/Polygonscan etc

Your query looks something like one of these

```
https://api.basescan.org/api
https://api.polygonscan.com/api
https://api.bscscan.com/api
https://api.apescan.io/api
```

Change your base URL to Etherscan, and point the chainId to `8453` or any chain you want

```
https://api.etherscan.io/v2/api?chainid=8453
```

### If you're starting with V2

Run this complete script with Node JS, `node script.js`

```javascript
async function main() {
  // query ETH balances on Arbitrum, Base and Optimism

  const chains = [42161, 8453, 10];

  for (const chain of chains) {
    // endpoint accepts one chain at a time, loop for all your chains

    const query = await fetch(`https://api.etherscan.io/v2/api
           ?chainid=${chain}
           &module=account
           &action=balance
           &address=0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511
           &tag=latest&apikey=YourApiKeyToken`);

    const response = await query.json();

    const balance = response.result;
    console.log(balance);
  }
}

main();
```
