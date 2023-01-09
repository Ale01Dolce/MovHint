const mongoose = require('mongoose');
const PreferenceSchema = require("./preferenceSchema");
const RecommendationSchema = require('./recommendationSchema');
const { Schema } = mongoose;
// The database schema used by mongoose to represent a single user in the app
const userSchema = new Schema({
    email: String,
    fullname: String,
    nickname: String,
    sessionToken: String,
    watchedMovies: [Number],
    ignoredMovies: [Number],
    preferences: PreferenceSchema,
    recommendations: [RecommendationSchema],
})

const User = mongoose.model("User", userSchema)
module.exports = User