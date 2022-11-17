require("dotenv").config();
const express = require('express')
const mongoose = require("mongoose");
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

await mongoose.connect(process.env.MONGODB_LOGIN);

app.use("/", require("./startup/routesInit"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})