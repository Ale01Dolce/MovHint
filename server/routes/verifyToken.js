const express = require('express')
const jwt = require("jsonwebtoken")
const User = require('../models/userSchema')
const router = express.Router()

router.use(async (req, res, next) => {

    // console.log(req.cookies)

    if(!req.cookies.token) {
        res.redirect(`${process.env.FRONTEND_URL}/login.html`)
        return next(new Error("no token header"))
    }

    // console.log(await User.findOne({sessionToken: req.cookies.token}), jwt.verify(req.cookies.token, process.env.PRIVATE_KEY))
    
    if(await User.findOne({sessionToken: req.cookies.token}) && jwt.verify(req.cookies.token, process.env.PRIVATE_KEY)) {
        next()
        
    } else {
        res.clearCookie("token")
        res.redirect(`${process.env.FRONTEND_URL}/login.html`)
        return next(new Error("Invalid Token Header"))
    }

})






module.exports = router