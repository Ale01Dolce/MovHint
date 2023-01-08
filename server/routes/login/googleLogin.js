const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken")
const router = express.Router()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../../models/userSchema")

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    return payload
}

router.post("/login/google", async (req, res, next) => {

    const userData = await verify(req.body.credential)
    
    if (!await User.findOne({ email: userData['email'] })) {
        const user = new User({ email: userData['email'], fullname: userData['name'] })
        await user.save()
    }

    const currentUser = await User.findOne({ email: userData['email'] })
    const userToken = jwt.sign(
        {email: currentUser.email},
        process.env.PRIVATE_KEY,
        { expiresIn: "30d" }
    )

    currentUser.sessionToken = userToken

    await currentUser.save()

    res.cookie("token", userToken, {maxAge: 1000 * 60 * 60 * 24 * 30})

    res.redirect(`${process.env.FRONTEND_URL}/index.html`)


})


module.exports = router