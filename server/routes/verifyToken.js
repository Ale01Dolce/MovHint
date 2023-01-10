const express = require('express')
const jwt = require("jsonwebtoken")
const User = require('../models/userSchema')
const router = express.Router()

// Express middleware for protecting certain routes, to make sure that the user has a valid access token
router.use(async (req, res, next) => {

    // If no token cookie is present, send 400 and pass error to Express 
    if(!req.headers.token) {
        res.sendStatus(400)
        return next(new Error("no token header"))
    }
    
    // If the user has a matching access token and the signature is correct, pass execution to the next middleware
    if(await User.findOne({sessionToken: req.headers.token}) && jwt.verify(req.headers.token, process.env.PRIVATE_KEY)) {
        next()
    } else {
        // Otherwise, send 400 and pass error to Express 
        res.status(400).clearCookie("token").send()
        return next(new Error("Invalid Token Header"))
    }

})






module.exports = router