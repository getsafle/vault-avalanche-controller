var assert = require('assert');
const Web3 = require('web3')
const tokenContract = require('./contract-json/TestToken.json');
const CryptoJS = require('crypto-js');
const { KeyringController: AvalancheKeyring, getBalance } = require('../src/index')

const {
    HD_WALLET_12_MNEMONIC,
    HD_WALLET_12_MNEMONIC_TEST_OTHER,
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
    EXTERNAL_ACCOUNT_PRIVATE_KEY,
    EXTERNAL_ACCOUNT_ADDRESS,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_1,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_2,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_3,
    AVALANCHE_NETWORK: {
        TESTNET,
        MAINNET
    },
    TRANSFER_AVALANCHE: {
        AVALANCHE_AMOUNT,
        AVALANCHE_RECEIVER
    },
    CONTRACT_TXN: {
        AVALANCHE_CONTRACT,
        AVALANCHE_AMOUNT_TO_CONTRACT
    },
} = require('./constants');

const CONTRACT_MINT_PARAM = {
    from: AVALANCHE_CONTRACT,
    to: '', // this will be the current account 
    amount: 1,
    nonce: 0,
    signature: [72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 220, 122]
}

const opts = {
    encryptor: {
        encrypt(pass, object) {
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(object), pass).toString();

            return ciphertext;
        },
        decrypt(pass, encryptedString) {
            const bytes = CryptoJS.AES.decrypt(encryptedString, pass);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            return decryptedData;
        },
    },
}

const opts_empty = {}

const PASSWORD = "random_password"

/**
 * Transaction object type
 * {    from: from address,
        to: to address,
        value: amount (in wei),
        data: hex string}
 */

describe('Initialize wallet ', () => {
    const avalancheKeyring = new AvalancheKeyring(opts)

    it("Create new vault and keychain", async () => {
        const res = await avalancheKeyring.createNewVaultAndKeychain(PASSWORD)
        console.log("res ", res)
    })

    it("Create new vault and restore", async () => {
        const res = await avalancheKeyring.createNewVaultAndRestore(PASSWORD, HD_WALLET_12_MNEMONIC)
        assert(avalancheKeyring.keyrings[0].mnemonic === HD_WALLET_12_MNEMONIC, "Wrong mnemonic")
    })

    it("Export account (privateKey)", async () => {
        const res = await avalancheKeyring.getAccounts()
        let account = res[0]
        const accRes = await avalancheKeyring.exportAccount(account)
        console.log("accRes ", accRes, Buffer.from(accRes, 'hex'))
    })

    it("Get accounts", async () => {
        const acc = await avalancheKeyring.getAccounts()
        console.log("acc ", acc)
    })

    it("Get fees with manual gasLimit", async () => {
        const accounts = await avalancheKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const tx = {
            gasLimit: 2100
        }
        const fees = await avalancheKeyring.getFees(tx, web3)
        console.log(" with manual gasLimit ", fees)

        const privateKey = await avalancheKeyring.exportAccount(accounts[0])
        const tx3 = await avalancheKeyring.sign(TESTING_MESSAGE_1, privateKey, web3)
        console.log("tx3 ", tx3)
    })

    it("Should import correct account ", async () => {
        const address = await avalancheKeyring.importWallet(EXTERNAL_ACCOUNT_PRIVATE_KEY)
        assert(address.toLowerCase() === EXTERNAL_ACCOUNT_ADDRESS.toLowerCase(), "Wrong address")
        assert(avalancheKeyring.importedWallets.length === 1, "Should have 1 imported wallet")
    })

    it("Get address balance", async () => {
        const accounts = await avalancheKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const balance = await getBalance(accounts[0], web3)
        console.log(" get balance ", balance, accounts)
    })
    it("Get fees for rawTransaction", async () => {
        const accounts = await avalancheKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const avalancheTx = {
            from: accounts[0],
            to:'0x641BB2596D8c0b32471260712566BF933a2f1a8e',
            value:100000000000000,
            data:'0x00'
        }
        const fees = await avalancheKeyring.getFees(avalancheTx, web3)
        console.log(" fees for the transaction ", fees)

    })
    it("sign Transaction ", async () => {

        const accounts = await avalancheKeyring.getAccounts()
        const from = accounts[0]
        const web3 = new Web3(TESTNET.URL);

        const count = await web3.eth.getTransactionCount(from);

        const defaultNonce = await web3.utils.toHex(count);

        const rawTx = {
            to: '0xca878f65d50caf80a84fb24e40f56ef05483e1cb',
            from,
            value: web3.utils.numberToHex(web3.utils.toWei('0.01', 'ether')),
            gasLimit: web3.utils.numberToHex(25000),
            maxPriorityFeePerGas: web3.utils.numberToHex(web3.utils.toWei('55', 'gwei')),
            maxFeePerGas: web3.utils.numberToHex(web3.utils.toWei('56', 'gwei')),
            nonce: defaultNonce,
            data: '0x00',
            type: '0x2',
            chainId: TESTNET.CHAIN_ID,
        };

        const privateKey = await avalancheKeyring.exportAccount(accounts[0])
        const signedTX = await avalancheKeyring.signTransaction(rawTx, privateKey)
        console.log("signedTX ", signedTX)

        // const sentTX = await polygonKeyring.sendTransaction(signedTX, web3)
        // console.log("sentTX ", sentTX)
    })
})