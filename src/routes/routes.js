/* eslint-disable strict */
/* 
    This is a route function
    containing route to main components
    of the faucet system
*/
const express = require("express")

let { Request } = require("../controllers/controllers.js")

const router = express.Router()

// creating main routing functions
// using POST for main functions
// new transaction request endpoint
router.post("/new", Request)

// Get transaction request status endpoint
router.post("/tx", (req, res) => {
    res.send("Hi, this a get transaction request status API endpoint")
})

// listen to 404 request
router.get("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found",
        error: {
            statusCode: 404,
            message:
                "You are trying to access a route that is not defined on this server.",
        },
    })
})

// exports router
module.exports = router
