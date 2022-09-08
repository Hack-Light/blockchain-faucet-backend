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

const { API_URL, PRIVATE_KEY, PUBLIC_KEY } = process.env

const web3 = new Web3(new Web3.providers.HttpProvider(API_URL))
// const privateKey = Buffer.from(PRIVATE_KEY, "hex")

exports.transferFund = async (recieverData, amountToSend, callback) => {
    try {
        const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") // nonce starts counting from 0
        let result = await web3.eth.getBalance(PUBLIC_KEY)
        let balance = web3.utils.fromWei(result, "ether")

        if (balance < amountToSend) {
            console.log("Insufficient funds")
            return { rStatus: false, hash: null }
        }

        const gasPrice = await web3.eth.getGasPrice()
        console.log(gasPrice, amountToSend)

        let details = {
            to: recieverData.toString(),
            value: web3.utils.toHex(web3.utils.toWei(amountToSend.toString())),
            gas: web3.utils.toHex(53000),
            gasPrice: web3.utils.toHex(10000000000),
            nonce: nonce,
            // chainId: CHAINID,
        }

        // const serializedTx = tx.serialize()
        const signedTx = await web3.eth.accounts.signTransaction(
            details,
            PRIVATE_KEY
        )

        await web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .on("receipt", function (receipt) {
                   callback({ hash: receipt.transactionHash, rStatus: true})
            })
    } catch (error) {
        console.log(error)
        callback({ rStatus: false, hash: null })
    }
}
