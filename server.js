"use strict"

if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line global-require
    require("dotenv").config()
}

const express = require("express")

const app = express()

app.use("*", (_req, _res) => {
    _res.status(404).json({
        success: false,
        message: "Page not found",
        error: {
            statusCode: 404,
            message:
                "You are trying to access a route that is not defined on this server.",
        },
    })
})

let port = process.env.PORT || 8080

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${port}`)
})
