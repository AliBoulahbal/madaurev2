// server/models/Summary.js

const mongoose = require('mongoose');

const summarySchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre du résumé est requis.'],
        trim: true,
    },
    subject: {
        type: String,
        required: [true, 'Le sujet (matière) du résumé est requis.'],
        trim: true,
    },
    fileUrl: {
        type: String,
        required: [true, 'L\'URL du fichier est requise.'],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'L\'ID du professeur est requis.'],
        ref: 'User', // Fait référence au modèle User
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