const express = require('express')
const router = express.Router()
const User = require("../../models/userSchema")

router.post("/logout", async (req, res, next) => {

    console.log("Logging out...")

    if (!req.cookies['token']) {
        res.sendStatus(400)
    }

    if (!await User.findOne({ sessionToken: req.cookies.token })) {
        res.sendStatus(400)
    }

    const currentUser = await User.findOne({ sessionToken: req.cookies.token })
    currentUser.sessionToken + ''

    await currentUser.save()

    res.clearCookie("token")
    res.sendStatus(400)
})

module.exports = router