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
const { walletDb, requestDb } = require("../models/models")

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
    } else {
        // check the time diffrence between the date now and last request
        let timeDiff = Date.now() - wallet.lastFunded
        if (timeDiff < 86400000) {
            return fail(_res, 400, "You can only request once a day")
        }
        // send token
        return success(_res, 200, "Token sent")
    }

    // then send token

    // if it does check last token sent time
    // if it is more than 24 hour send token
    // if not send error
}
