const mongoose = require('mongoose');
const { Schema } = mongoose;
// The database schema used by mongoose to represent the movie recommendations for the user
const RecommendationSchema = new Schema({
    title: String,
    runtime: Number,
    genres: [String],
    providers: [{ logo_path: String, provider_id: Number, provider_name: String, display_priority: Number}],
    release_date: Date,
    poster_path: String,
    MovieDBid: Number,
    overview: String,

}, { _id: false })

module.exports = RecommendationSchema