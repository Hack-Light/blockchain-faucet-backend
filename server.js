"use strict"

if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line global-require
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const route = require("./src/routes/routes.js")
// const path = require("path")
const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: false, limit: "50mb" }))
app.use(cors())

app.use("/", route)

let port = process.env.PORT || 8080

// Set up default mongoose connection

mongoose
    .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("DB connected")
    })

// Get the default connection
const db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
// eslint-disable-next-line no-console
db.on("error", console.error.bind(console, "MongoDB connection error:"))

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`)
})

module.exports = app;