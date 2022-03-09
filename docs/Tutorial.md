## Note
Hello,

I was going to try implementing all the necessary functionality, but I found out that all of it was already implemented in the official JavaScript library written by the Avalanche developers (https://github.com/ava-labs/avalanchejs). I’m not sure what the end-use of it will be, but if you only want to interact with the Avalanche ecosystem the best way to do it is using the official library. Anything else would lack all the features and be considerably less safe. Developing a new package that does exactly what the official package already does would be pointless too. Following is a tutorial on how to accomplish all the requirements of the bounty using AvalancheJs. Refer to the official documentation at https://docs.avax.network/ and the GitHub repo for all the supported features.

## Installation
Run:
```
npm install avalanche
```

## Initialization
Don't forget to use the right api nodes, ports, and network ids.
```javascript
import { Avalanche, BinTools, Buffer, BN } from "avalanche"
const bintools = BinTools.getInstance()
let avalanche = new Avalanche("api.avax-test.network", 443, "https", 5) // If you are connecting to the testnet through the public api. Otherwise, use your own node port and IP address
// The parameters for the main network are "api.avax.network", 443, "https", 1
let xChain = avalanche.XChain() // Returns an object to interact with the X-Chain
let pChain = avalanche.PChain() // Returns an object to interact with the P-Chain
let cChain = avalanche.CChain() // Returns an object to interact with the C-Chain
let infoApi = avalanche.Info() // Returns an object to query for network information
```

## Account management
```javascript
let keyring = xChain.keyChain() // Returns an object for key and address management. Also works for P-Chain and C-Chain
```
KeyChain is documented at https://docs.avax.network/build/tools/avalanchejs/classes/api_evm_keychain.keychain

```javascript
let keypair = keyring.makeKey() // Creates new key pair
```
KeyPair is documented at https://docs.avax.network/build/tools/avalanchejs/classes/api_evm_keychain.keypair

If you are going to store the private keys somewhere (a JSON file or .env file), you can then use keyring.importKey() to import it into your KeyChain object. It works between different chain classes so you can use it in all blockchains. For example:
```javascript
let pk = keyring.makeKey() // Creates new key pair with X-Chain object
let pks = pk.getPrivateKeyString() // Exports private key as string

let cChain = avalanche.CChain() // Create new C-Chain object
let keyringC = cChain.keyChain() // Exports C-Chain object KeyChain
keyringC.importKey(pks) // Import private key into C-Chain KeyChain
```

## Working with transactions
All the chain objects provide methods to create all the different types of transaction the ecosystem
supports. For example, use xChain.buildBaseTx() with the required parameters, which returns an unsigned transaction object, to create an X-Chain
unsigned transaction. These methods are documented at:

**X-Chain:** https://docs.avax.network/build/tools/avalanchejs/classes/api_avm.avmapi

**P-Chain:** https://docs.avax.network/build/tools/avalanchejs/classes/api_platformvm.platformvmapi

**C-Chain:** https://docs.avax.network/build/tools/avalanchejs/classes/api_evm.evmapi

```javascript
let signedTx = xChain.signTx(unsignedTx) // Signs an X-Chain transaction. Also works for P-Chain and C-Chain
let txId = await xchain.issueTx(signedTx) // Broadcasts an X-Chain transaction. Also works for P-Chain and C-Chain
```

## Get network fees
```javascript
let fees = await info.getTxFee() // Returns transaction fees
```
The info API is documented at https://docs.avax.network/build/tools/avalanchejs/classes/api_info.infoapi. You can use it to get more information other than the fees.
