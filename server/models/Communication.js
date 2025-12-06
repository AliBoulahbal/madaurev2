// server/models/Communication.js

const mongoose = require('mongoose');

const communicationSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Peut être un professeur
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isResponse: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Communication = mongoose.model('Communication', communicationSchema);

module.exports = Communication;