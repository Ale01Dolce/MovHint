const express = require('express')
const router = express.Router()
const User = require("../../models/userSchema")

router.post("/logout", async (req, res, next) => {

    console.log("Logging out...")

    if (!req.cookies['token']) {
        res.sendStatus(200)
    }

    if (!await User.findOne({ sessionToken: req.cookies.token })) {
        res.sendStatus(200)
    }

    const currentUser = await User.findOne({ sessionToken: req.cookies.token })
    currentUser.sessionToken = ''

    await currentUser.save()

    res.clearCookie("token").status(200).send()
})

module.exports = router