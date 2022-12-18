const mongoose = require('mongoose');
const { Schema } = mongoose;

const popularSchema = new Schema({
    data: {
        type: Schema.Types.Mixed
    }
})

const Popular = mongoose.model("Popular", popularSchema)
module.exports = Popular