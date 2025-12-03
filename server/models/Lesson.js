// server/src/models/Lesson.js

const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Référence au modèle User (qui sera aussi utilisé pour les Teachers)
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Durée en minutes
        required: true,
    },
    videoUrl: {
        type: String, // Lien vers la vidéo enregistrée (ex: Cloudinary, YouTube)
        default: null,
    },
    isLive: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'live', 'completed', 'cancelled'],
        default: 'scheduled',
    }
}, {
    timestamps: true,
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;