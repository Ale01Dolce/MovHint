const express = require('express')
const router = express.Router()

//Initalization of the express routes used in the app
router.use("/", require("../routes/login/fbLogin"))
router.use("/", require("../routes/login/googleLogin"))
router.use("/", require("../routes/login/logout"))

//Initalization of the express *protected* routes used in the app, where a valid token has to be provided for it to work
router.use("/", require("../routes/verifyToken"), require("../routes/protected/userDetails"))
router.use("/", require("../routes/verifyToken"), require("../routes/protected/preferencesFormHandling"))
router.use("/", require("../routes/verifyToken"), require("../routes/protected/recommendations"))

module.exports = router