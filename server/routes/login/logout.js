const express = require('express')
const router = express.Router()
const User = require("../../models/userSchema")

router.post("/logout", async (req, res, next) => {

    console.log("Logging out...")

    // Verify that the token in even present in the first place
    if (!req.cookies['token']) {
        res.sendStatus(200)
        return
    }

    // If no user is present with the token, just delete the cookie
    if (!await User.findOne({ sessionToken: req.headers.token })) {
        res.sendStatus(200)
        return
    }

    // Else, get the user, remove the token from the Database, then delete the cookie from the client
    const currentUser = await User.findOne({ sessionToken: req.headers.token })
    currentUser.sessionToken = ''

    await currentUser.save()

    res.clearCookie("token").status(200).send()
    return
})

module.exports = router