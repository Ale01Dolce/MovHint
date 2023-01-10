// Inialization of .env variabiles in the process environment
require("dotenv").config();
const express = require('express')
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors');

// Definition of the Cross-Origin Resource Sharing rules, to allow the frontend to access the backend
const corsOption = {
  origin: [new URL(process.env.FRONTEND_URL).origin],
  credentials: true,
  allowedHeaders: ['token', 'content-type']
};

// Definition of the port express is going to use
const port = process.env.PORT || 3000;
console.log(process.env)
// Inialization of the connection with the database, using the connection string in .env
mongoose.connect(process.env.MONGODB_LOGIN);

// Inialization of various express middlewares, for handling CORS, json data, form data, and cookies sent from the client
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors(corsOption));
app.use(cookieParser())

// Inialization of the app endpoints, with an affixed /api for every handler
app.use("/api", require("./startup/routesInit"))

// Startup of the express server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})