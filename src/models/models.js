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

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1:27017/faucetdatabase"
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

// Get the default connection
const db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
// eslint-disable-next-line no-console
db.on("error", console.error.bind(console, "MongoDB connection error:"))

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
            return { status: true , _id}
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
                    return{ status: "error", msg: "Internal database error" }
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
                    return { status: true , p}
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
                address: String,
                lastfunded: Number,
                amount: Number,
            })
        )
    }

    create(addr) {
        /*
        This functions create a new wallet
        data and store in the database
        It returns the wallet Id
      */
        // create id
        let _id = uuid.v4()
        let mData = { id: _id, lastfunded: 0, address: addr + "", amount: 0 }
        new this.model(mData).save((err) => {
            if (err) return{ status: "error", msg: "Internal database error" }
            return { status: true , _id}
        })
    }

    save(params) {
        /*
        This functions saves or modify a wallet
        data and store in the database
        It returns either true|false|null
      */
        // get the specified request from database
        if (params.id != undefined && params.id != null) {
            let p = {}
            if (params.lastfunded) {
                p.lastfunded = params.lastfunded
            }
            if (params.address) {
                p.address = params.address + ""
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
                        return{
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
            return{ status: "error", msg: "No request id found" }
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
                    return { status: true , p}
                }
            })
        } else {
            // no request id found
            return { status: "error", msg: "No request id found" }
        }
    }

    find(addr) {
        /*
        This functions finds a wallet
        data and using any address given  
        It returns the wallet Json data
      */
        if (addr) {
            // find the request dat
            this.model.find((err, res) => {
                if (err)
                  return  { status: "error", msg: "Internal database error" }
                for (let i = 0; i < res.length; i++) {
                    // turn address to array
                    if (res[i].address.split(",").includes(addr)) {
                        // has found
                        let p = {
                            lastfunded: res[i].lastfunded,
                            id: res[i].id,
                            address: res[i].address,
                            amount: res[i].amount,
                        }
                        return { status: true , p}
                       
                    }
                }
                return { status: true }
            })
        } else {
            // no request id found
            return{ status: "error", msg: "No address found" }
        }
    }
}
// create request and wallet objects for exports
const _request = new _Request()
const _wallet = new _Wallet()

// exports modules
exports.walletDb = _wallet
exports.requestDb = _request
