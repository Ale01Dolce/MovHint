const express = require('express')
const User = require('../../models/userSchema')
const router = express.Router()

router.post("/preferencesFormHandling", async (req, res, next) => {

    const userDetails = await User.findOne({sessionToken: req.cookies.token})
    console.log(req.body)
    userDetails.preferences = req.body
    await userDetails.save()
    
    res.send(JSON.stringify(userDetails.toJSON()))
    //res.redirect("http://localhost:5000/client/")
})


module.exports = router