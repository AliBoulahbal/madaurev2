const mongoose = require('mongoose');

// Schéma pour les options de réponse
const optionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// Schéma pour les questions du quiz
const questionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [optionSchema], // Tableau des options de réponse
});

// Schéma principal du Quiz
const quizSchema = mongoose.Schema({
    // Un quiz est souvent lié à une leçon (optionnel si c'est un quiz autonome)
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson', 
        required: false, // Rendre ceci obligatoire si les quiz sont toujours intégrés aux leçons
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
    },
    questions: [questionSchema], // Tableau des questions
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    minScoreToPass: {
        type: Number,
        default: 70, // 70% est le score par défaut pour réussir
    },
}, {
    timestamps: true,
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;