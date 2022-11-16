require("dotenv").config();
require("mongoose")

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect(process.env.MONGODB_LOGIN);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})