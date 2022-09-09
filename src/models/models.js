/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable new-cap */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
/* eslint-disable strict */
/* 
    This is a model function
    containing models to main components
    of the faucet system
*/

// Import the mongoose module
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uuid = require("uuid")

// creating REQUEST database class
class _Request {
    /*
        This class controls the Request
        model database connection
    */
    model = null

    constructor() {
        // initialize database schema
        this.model = mongoose.model(
            "request",
            new Schema({
                id: String,
                status: String,
                created: Number,
                finished: Number,
                address: String,
                tx: String,
            })
        )
    }

    create(addr) {
        /*
        This functions create a new request
        data and store in the database
        It returns the request Id
      */
        // create id
        let _id = uuid.v4()
        let mData = {
            id: _id,
            status: "started",
            created: Date.now(),
            finished: Date.now(),
            address: addr,
            tx: " ",
        }
        new this.model(mData).save((err) => {
            if (err) return { status: "error", msg: "Internal database error" }
            return { status: true, _id }
        })
    }

    save(params) {
        /*
        This functions saves or modify a request
        data and store in the database
        It returns either true|false|null
      */
        // get the specified request from database
        if (params.id != undefined && params.id != null) {
            // validate results
            if (params.status !== undefined && params.status !== null) {
                let p = params.status.toLowerCase()
                if (
                    p !== "success" &&
                    p !== "failed" &&
                    p !== "pending" &&
                    p !== "ineligible" &&
                    p !== "invalid"
                ) {
                    return { status: "error", msg: "Invalid status data" }
                }
            }
            let p = {}
            if (params.status) {
                p.status = params.status.toLowerCase()
                // check if its finished
                if (p.status == "success" || p.status === "failed") {
                    // add finished parametres
                    p.finished = Date.now()
                }
            }
            if (params.tx) {
                p.tx = params.tx
            }
            if (params.address) {
                p.address = params.address
            }
            this.model.findOneAndUpdate(
                { id: params.id },
                p,
                { new: true },
                (err, res) => {
                    if (err)
                        return {
                            status: "error",
                            msg: "Internal database error",
                        }
                    if (res != null) {
                        return { status: true }
                    }
                }
            )
        } else {
            // no request id found
            return { status: "error", msg: "No request id found" }
        }
    }

    get(id) {
        /*
        This functions get a request
        data and store in the database
        It returns the request Json data
      */
        if (id) {
            // find the request dat
            this.model.find({ id: id }, (err, res) => {
                if (err)
                    return { status: "error", msg: "Internal database error" }
                if (res != null) {
                    res = res[0]
                    let p = {
                        status: res.status,
                        id: res.id,
                        address: res.address,
                        created: res.created,
                        finished: res.finished,
                        tx: res.tx,
                    }
                    return { status: true, p }
                }
            })
        } else {
            // no request id found
            return { status: "error", msg: "No request id found" }
        }
    }
}
// creating WALLET database class
class _Wallet {
    /*
        This class controls the Wallet
        model database connection
    */
    model = null

    constructor() {
        // initialize database schema
        this.model = mongoose.model(
            "wallet",
            new Schema({
                id: String,
                address: Array,
                lastfunded: Number,
                amount: Number,
            })
        )
    }

    create(addr, callback) {
        /*
        This functions create a new wallet
        data and store in the database
        It returns the wallet Id
      */
        // create id
        let _id = uuid.v4()
        let mData = {
            id: _id,
            lastfunded: Date.now(),
            address: addr,
            amount: 0,
        }

        console.log("Creating new wallet", mData)
        this.model.create(mData, (err, data) => {
            console.log(err, data)
            if (err) {
                return callback({
                    status: false,
                    msg: "Internal database error",
                })
            }

            console.log("saved")
            return callback({ status: true, _id: data.id })
        })
    }

    save(params, callback) {
        /*
        This functions saves or modify a wallet
        data and store in the database
        It returns either true|false|null
      */
        // get the specified request from database

        console.log("params", params)
        if (params.id != undefined && params.id != null) {
            let p = {}
            if (params.lastfunded) {
                p.lastfunded = params.lastfunded
            }
            if (params.address) {
                p.address = params.address
            }
            if (params.amount) {
                p.amount = params.amount
            }
            this.model.findOneAndUpdate(
                { id: params.id },
                p,
                { new: true },
                (err, res) => {
                    if (err)
                        callback({
                            status: false,
                            msg: "Internal database error",
                        })
                    if (res != null) {
                        callback({ status: true })
                    }
                }
            )
        } else {
            // no request id found
            return callback({ status: false, msg: "No request id found" })
        }
    }

    get(id) {
        /*
        This functions get a wallet
        data and store in the database
        It returns the wallet Json data
      */
        if (id) {
            // find the request dat
            this.model.find({ id: id }, (err, res) => {
                if (err)
                    return { status: "error", msg: "Internal database error" }
                if (res != null) {
                    res = res[0]
                    let p = {
                        lastfunded: res.lastfunded,
                        id: res.id,
                        address: res.address,
                        amount: res.amount,
                    }
                    return { status: true, p }
                }
            })
        } else {
            // no request id found
            return { status: "error", msg: "No request id found" }
        }
    }

    find(addr, callback) {
        /*
        This functions finds a wallet
        data and using any address given  
        It returns the wallet Json data
      */
        if (addr) {
            // find the request dat
            this.model.find({ address: addr }, (err, res) => {
                console.log("db res", res)
                if (err || res.length == 0) {
                    return callback({
                        status: false,
                        msg: "Internal database error",
                    })
                }
                let p = res[0]
                return callback({ status: true, data: p })

                // for (let i = 0; i < res.length; i++) {
                //     console.log(res)
                //     // turn address to array
                //     if (res[i].address.split(",").includes(addr)) {
                //         // has found
                //         p = {
                //             lastfunded: res[i].lastfunded,
                //             id: res[i].id,
                //             address: res[i].address,
                //             amount: res[i].amount,
                //         }
                //         // return callback({ status: true, p })
                //     }
                // }
            })
        } else {
            // no request id found
            callback({ status: false, msg: "No address found" })
        }
    }
}
// create request and wallet objects for exports
const _request = new _Request()
const _wallet = new _Wallet()

// exports modules
exports.walletDb = _wallet
exports.requestDb = _request
