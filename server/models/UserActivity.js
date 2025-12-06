// server/models/UserActivity.js

const mongoose = require('mongoose');

const userActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    activityType: {
        type: String,
        enum: ['lesson_start', 'lesson_complete', 'quiz_attempt', 'quiz_pass', 'summary_download', 'teacher_message'],
        required: true,
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        // ID de la leçon, du résumé, du quiz, etc., lié à l'activité
        default: null, 
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Pour stocker score, temps passé, ou URL de téléchargement
        default: {},
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;