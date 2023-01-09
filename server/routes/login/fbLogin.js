const { default: axios } = require('axios')
const express = require('express')
const jwt = require("jsonwebtoken")
const router = express.Router()
const User = require("../../models/userSchema")

router.post("/login/fb", async (req, res, next) => {

    //Get user details from the Facebook Graph API
    var userDetails = await axios.get("https://graph.facebook.com/me?" + new URLSearchParams({
        access_token: req.body.accessToken,
        fields: "name,email",
    }))
    .catch(e => console.error(e.response.data))

    console.log(userDetails.data)

    //If no user exists with the email found, create a new one
    if (!await User.findOne({ email: userDetails.data.email })) {
        const user = new User({ email: userDetails.data.email, fullname: userDetails.data.name })
        await user.save()
    }

    //Get the user with the corresponding email
    const currentUser = await User.findOne({ email: userDetails.data.email })
    console.log(currentUser)

    //Create and sign an access token to send to the user as a cookie
    const userToken = jwt.sign(
        {email: currentUser.email},
        process.env.PRIVATE_KEY,
        { expiresIn: "30d" }
    )

    currentUser.sessionToken = userToken

    await currentUser.save()

    //Send the access token to the user
    res.cookie("token", userToken, { maxAge: 1000 * 60 * 60 * 24 * 30, domain: new URL(process.env.FRONTEND_URL).hostname, httpOnly: true, secure: true, sameSite: 'none' })

    res.redirect(`${process.env.FRONTEND_URL}/login.html`)
})

module.exports = router
