const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken")
const router = express.Router()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../../models/userSchema")

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload
}

router.post("/login/google", async (req, res, next) => {
    // Verify that the JWT is actually coming from Google
    const userData = await verify(req.body.credential)
    
    // If no user with the corresponding email is found, create a new one
    if (!await User.findOne({ email: userData['email'] })) {
        const user = new User({ email: userData['email'], fullname: userData['name'] })
        await user.save()
    }

    // Find the user with the corresponding email
    const currentUser = await User.findOne({ email: userData['email'] })

    //Create and sign an access token to send to the user as a cookie
    const userToken = jwt.sign(
        {email: currentUser.email},
        process.env.PRIVATE_KEY,
        { expiresIn: "30d" }
    )

    currentUser.sessionToken = userToken

    await currentUser.save()

    //Send the access token to the user
    res.cookie("token", userToken, {maxAge: 1000 * 60 * 60 * 24 * 30})

    res.redirect(`${process.env.FRONTEND_URL}/dashboard.html`)


})


module.exports = router