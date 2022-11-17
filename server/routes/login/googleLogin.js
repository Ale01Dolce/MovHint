const express = require('express')
const router = express.Router()

router.post("/login/google", (req, res) => {
    res.status(400).send()
})

router.get("/login/google", (req, res) => {
    res.send("pog")
})

module.exports = router