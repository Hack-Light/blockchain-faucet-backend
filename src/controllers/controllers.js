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

exports.Request = async (_req, _res) => {
    const { address } = _req.body
    // validate data
    if (!address) {
        return fail(_res, 422, "Address is required to complete the request")
    }
    // check if address exist it db
    walletDb.find(address[0], (wallet) => {
        console.log("me tye", wallet)
        if (!wallet.status) {
            walletDb.create(address, ({ status, id }) => {
                // send token
                if (status) {
                    transferFund(address[0], 30, (json) => {
                        if (json.rStatus) {
                            walletDb.save(
                                {
                                    id,
                                    lastFunded: Date.now,
                                },
                                (res) => {
                                    if (res.status) {
                                        return success(
                                            _res,
                                            200,
                                            "Fund transfered successfully"
                                        )
                                    } else {
                                        return fail(
                                            _res,
                                            500,
                                            "Token could not be transfered, try agin later"
                                        )
                                    }
                                }
                            )
                        } else {
                            return fail(
                                _res,
                                500,
                                "Token could not be transfered, try agin later"
                            )
                        }
                    })
                } else {
                    return fail(
                        _res,
                        500,
                        "Token could not be transfered, try agin later"
                    )
                }
            })
        } else {
            // check the time diffrence between the date now and last request

            let timeDiff = Date.now() - wallet.data.lastfunded
            console.log("me tye", Date.now(), wallet.data.lastFunded)
            if (timeDiff < 86400000) {
                return fail(_res, 400, "You can only request once a day")
            }
            // send token
            console.log(address)
            transferFund(address[0], 30, (json) => {
                if (json.rStatus) {
                    console.log("reached here")
                    walletDb.save(
                        {
                            id: wallet.data.id,
                            lastFunded: Date.now(),
                        },
                        (res) => {
                            if (res.status) {
                                return success(
                                    _res,
                                    200,
                                    "Fund transfered successfully"
                                )
                            } else {
                                return fail(
                                    _res,
                                    500,
                                    "Token could not be transfered, try agin later"
                                )
                            }
                        }
                    )
                } else {
                    return fail(
                        _res,
                        500,
                        "Token could not be transfered, try agin later"
                    )
                }
            })
        }
    })

    // then send token

    // if it does check last token sent time
    // if it is more than 24 hour send token
    // if not send error
}
