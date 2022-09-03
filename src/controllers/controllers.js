/* eslint-disable no-else-return */
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

let { fail, success } = require("../utils/response.util")
const { walletDb } = require("../models/models")
const { transferFund } = require("../services/transfer-fund")

exports.Request = (_req, _res) => {
    const { address } = _req.body
    // validate data
    if (!address) {
        return fail(_res, 422, "Adress is required to complete the request")
    }
    // check if address exist it db
    let wallet = walletDb.find(address)

    if (!wallet) {
        wallet = walletDb.create({ address })
        // send token
        let { hash, rStatus } = transferFund(address.split(","[0]), 0.5)
        if (rStatus) {
            console.log(hash)
            walletDb.save({
                lastFunded: Date.now,
            })
            return success(_res, 200, "Fund transfered successfully")
        } else {
            return fail(
                _res,
                500,
                "Token could not be transfered, try agin later"
            )
        }
    } else {
        // check the time diffrence between the date now and last request
        let timeDiff = Date.now() - wallet.lastFunded
        if (timeDiff < 86400000) {
            return fail(_res, 400, "You can only request once a day")
        }
        // send token
        let { hash, rStatus } = transferFund(address.split(","[0]), 0.5)

        if (rStatus) {
            console.log(hash)
            walletDb.save({
                lastFunded: Date.now,
            })
            return success(_res, 200, "Fund transfered successfully")
        } else {
            return fail(
                _res,
                500,
                "Token could not be transfered, try agin later"
            )
        }
    }

    // then send token

    // if it does check last token sent time
    // if it is more than 24 hour send token
    // if not send error
}
