const { default: axios } = require('axios')
const express = require('express')
const jwt = require("jsonwebtoken")
const router = express.Router()
const User = require("../../models/userSchema")

router.post("/login/fb", async (req, res, next) => {


    var userDetails = await axios.get("https://graph.facebook.com/me?" + new URLSearchParams({
        access_token: req.body.accessToken,
        fields: "name,email",
    }))
    .catch(e => console.error(e.response.data))

    console.log(userDetails.data)

    if (!await User.findOne({ email: userDetails.data.email })) {
        const user = new User({ email: userDetails.data.email, fullname: userDetails.data.name })
        await user.save()
    }

    const currentUser = await User.findOne({ email: userDetails.data.email })
    console.log(currentUser)
    const userToken = jwt.sign(
        {email: currentUser.email},
        process.env.PRIVATE_KEY,
        { expiresIn: "30d" }
    )

    currentUser.sessionToken = userToken

    await currentUser.save()

    res.cookie("token", userToken, {maxAge: 1000 * 60 * 60 * 24 * 30})

    res.redirect(`${process.env.FRONTEND_URL}/login.html`)
})

module.exports = router
