const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()

// Endpoint for getting the user details, using the GET http verb
router.get("/userDetails", async (req, res, next) => {

    // Get user from database
    const userDetails = await User.findOne({sessionToken: req.headers.token})
    
    // Return JSON object of the user
    res.send(JSON.stringify(userDetails.toJSON()))
})


module.exports = router