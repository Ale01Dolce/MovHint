const express = require('express')
const router = express.Router()

router.post("/signup/google", (req, res) => {
    console.log(req.body)
    res.send(req.body)
})

router.get("/signup/google", (req, res) => {
    res.send("Pog 2")
})

module.exports = router