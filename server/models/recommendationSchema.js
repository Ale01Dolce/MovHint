const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecommendationSchema = new Schema({
    title: String,
    runtime: Number,
    genres: [String],
    providers: [{image_url: String}],
    release_date: String,
    poster_path: String,

}, { _id: false })

module.exports = RecommendationSchema