const mongoose = require('mongoose');
const PreferenceSchema = require("./preferenceSchema")
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    fullname: String,
    nickname: String,
    sessionToken: String,
    watchedMovies: [Number],
    preferences: PreferenceSchema
})

const User = mongoose.model("User", userSchema)
module.exports = User