const express = require('express')
const router = express.Router()

router.use("/", require("../routes/login/fbLogin"))
router.use("/", require("../routes/login/googleLogin"))
router.use("/", require("../routes/verifyToken"), require("../routes/protected/userDetails"))
router.use("/", require("../routes/verifyToken"), require("../routes/protected/preferencesFormHandling"))

module.exports = router