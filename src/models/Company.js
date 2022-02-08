const mongoose = require("mongoose")

const comoanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    locations: [{
        type: String,
    }],
    hashtags: [{
        type: String,
    }],
    isUpdated: {
        type: Boolean,
        default: true
    },
    messageId: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Company", comoanySchema);
