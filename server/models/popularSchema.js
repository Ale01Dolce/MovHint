const mongoose = require('mongoose');
const { Schema } = mongoose;
// The database schema used by mongoose to initialize the database with the most popular movies
const popularSchema = new Schema({
    data: {
        type: Schema.Types.Mixed
    }
})

const Popular = mongoose.model("Popular", popularSchema)
module.exports = Popular