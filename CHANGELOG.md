### 1.0.0 (2022-01-10)

##### Avalanche Keyring Implementation

- Implemented Keyring functionality to enable account generation, export keys and signing methods

### 1.0.1 (2022-01-21)

##### Implement import wallet functionality

- Added importWallet() to import account using privateKey.

### 1.1.0 (2022-02-16)

##### Implement get balance functionality

- Added getBalance() to fetch the balance in native currency.

### 1.2.0 (2022-03-05)

##### Implement sign functionality

- Added sign() to sign a message or transaction and get signature along with v,r,s.


### 1.2.1 (2023-11-28)

##### Implemented Type2 Transaction Signing and Updated readme

- Updated signTransaction() to sign type 2 transactions.

- Updated README.md and added badges. 

- Updated getFees() method for gas estimation for type-2 transaction.

- Added the tests for getFees() in test suite. 

- Updated import wallet with Ox prefix slicing.

### 1.2.2 (2024-02-14)

- Downgraded ethereumjs module to 3.4.0 version.