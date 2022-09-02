/* eslint-disable strict */
exports.success = (res, status, entity, msg) =>
    res.status(status || 200).json({
        success: true,
        data: entity || [],
        message: msg || "Operations successful",
    })

exports.fail = (res, status, msg) =>
    res.status(status || 200).json({
        success: false,
        data: [],
        message: msg || "Operation failed!",
    })
