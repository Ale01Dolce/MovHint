require("dotenv").config();
const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

// mongoose.connect(process.env.MONGODB_LOGIN);

app.use("/", require("./startup/routesInit"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})