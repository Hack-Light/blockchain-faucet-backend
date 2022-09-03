/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable strict */
// eslint-disable-next-line strict
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable new-cap */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
/* eslint-disable strict */

const Web3 = require("web3")

const { API_URL, PRIVATE_KEY, PUBLIC_KEY, CHAINID } = process.env

const web3 = new Web3(new Web3.providers.HttpProvider(API_URL))

exports.transferFund = async (recieverData, amountToSend) => {
    try {
        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") // nonce starts counting from 0
        let result = await web3.eth.getBalance(PUBLIC_KEY)
        let balance = web3.utils.fromWei(result, "ether")

        if (balance < amountToSend) {
            console.log("Insufficient funds")
            return { rStatus: false, hash: null }
        }

        const gasPrice = await web3.eth.getGasPrice()

        console.log(balance + " INDO")

        let details = {
            to: recieverData.address,
            value: web3.utils.toHex(
                web3.utils.toWei(amountToSend.toString(), "ether")
            ),
            gas: 21000,
            gasPrice: gasPrice * 1000000000,
            nonce: nonce,
            chainId: CHAINID,
        }

        // const transaction = {
        //     'to': '0x31B98D14007bDEe637298086988A0bBd31184523', // faucet address to return eth
        //     'value': 1000000000000000000, // 1 ETH
        //     'gas': 30000,
        //     'nonce': nonce,
        //     // optional data field to send message or execute smart contract
        // };

        const signedTx = await web3.eth.accounts.signTransaction(
            details,
            PRIVATE_KEY
        )

        let hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        return { rStatus: true, hash: hash }
    } catch (error) {
        console.log(error)
        return { rStatus: false, hash: null }
    }
}
