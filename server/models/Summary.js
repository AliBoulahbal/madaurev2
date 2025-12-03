// server/src/models/Summary.js

const mongoose = require('mongoose');

const summarySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'ملخص شامل للمادة.',
    },
    fileUrl: {
        type: String, // Lien vers le fichier (ex: PDF stocké sur Cloudinary)
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    downloadsCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;