const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecommendationSchema = new Schema({
    title: String,
    runtime: Number,
    genres: [String],
    providers: [{ logo_path: String, provider_id: Number, provider_name: String, display_priority: Number}],
    release_date: String,
    poster_path: String,

}, { _id: false })

module.exports = RecommendationSchema