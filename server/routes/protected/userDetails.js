const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()

router.get("/userDetails", async (req, res, next) => {

    const userDetails = await User.findOne({sessionToken: req.cookies.token})
    
    res.send(JSON.stringify(userDetails.toJSON()))
})


module.exports = router