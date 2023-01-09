const mongoose = require('mongoose');
const PreferenceSchema = require("./preferenceSchema");
const RecommendationSchema = require('./recommendationSchema');
const { Schema } = mongoose;

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