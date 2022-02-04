const mongoose = require("mongoose")

const LastSchema = new mongoose.Schema({
    where: {
        type: String,
        required: true
    },
    guid: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Last", LastSchema);
