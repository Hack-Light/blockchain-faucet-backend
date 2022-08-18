"use strict"

if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line global-require
    require("dotenv").config()
}

const express = require("express")
const route = require("./src/routes/routes.js")
const path = require("path")
const app = express()

app.use("/", route)

let port = process.env.PORT || 8080

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`)
})
 
