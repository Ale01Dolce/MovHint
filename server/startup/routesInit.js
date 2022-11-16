const express = require('express')
const router = express.Router()

router.use("/", require("../routes/signup/googleSignup"))
router.use("/", require("../routes/login/googleLogin"))

module.exports = router