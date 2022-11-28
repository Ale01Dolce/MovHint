require("dotenv").config();
const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express()
const cors = require('cors');

const corsOption = {
  origin: ['http://localhost:5000'],
  credentials: true,
};

const port = 3000

mongoose.connect(process.env.MONGODB_LOGIN);

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOption));


app.use("/api", require("./startup/routesInit"))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})