const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    fullname: String,
    nickname: String,
    sessionToken: String,
})

const User = mongoose.model("User", userSchema)
module.exports = User