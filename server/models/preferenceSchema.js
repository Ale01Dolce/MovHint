const mongoose = require('mongoose');
const { Schema } = mongoose;
// The database schema used by mongoose to represent the user preferences
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