const mongoose = require('mongoose');
const { Schema } = mongoose;

const PreferenceSchema = new Schema({
    adult: Boolean,
    languages: String,
    length: Number,
    genres: [String]
})

module.exports = PreferenceSchema