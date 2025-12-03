// server/src/models/FAQ.js

const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['general', 'technical', 'billing', 'lessons'],
        default: 'general',
    },
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;