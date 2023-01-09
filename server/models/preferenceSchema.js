const mongoose = require('mongoose');
const { Schema } = mongoose;

const PreferenceSchema = new Schema({
    adult: Boolean,
    length: Number,
    genres: [Number],
    country: {
        type: String,
        uppercase: true
    },
    isOld: Boolean,
    isPopular: Boolean,
    easilyWatchable: Boolean,
}, { _id: false })

module.exports = PreferenceSchema