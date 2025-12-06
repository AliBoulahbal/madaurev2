// server/models/Lesson.js

const mongoose = require('mongoose');

// --- 1. Sous-Schéma pour les Questions/Options de Quiz ---
const QuizOptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
}, { _id: false }); // Pas besoin d'ID pour chaque option

const QuizQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [QuizOptionSchema],
        required: true,
        validate: {
            // Assure qu'il y a au moins une réponse correcte
            validator: (opts) => opts.some(opt => opt.isCorrect),
            message: 'Chaque question doit avoir au moins une réponse correcte.',
        },
    },
}, { _id: false }); // Pas besoin d'ID pour chaque question

// --- 2. Sous-Schéma pour les Données de Contenu (Videos, Textes, Quiz, Summaries) ---
const ContentDataSchema = new mongoose.Schema({
    // Pour type: 'video'
    url: { type: String, trim: true },
    // Pour type: 'text'
    body: { type: String },
    // Pour type: 'quiz'
    questions: { type: [QuizQuestionSchema] },
    // Pour type: 'summary-ref'
    summaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Summary' },

}, { _id: false, strict: false }); // Utilisation de strict: false pour permettre des champs non définis

// --- 3. Schéma de Base pour les Blocs de Contenu ---
const ContentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['video', 'text', 'quiz', 'summary-ref'],
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        required: true,
    },
    data: {
        type: ContentDataSchema, // Le sous-schéma qui contient les données spécifiques
        required: true,
    }
}, { _id: false }); // Pas besoin d'ID pour chaque bloc

// --- 4. Schéma de la Leçon Principale ---
const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre du cours est requis.'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'La description du cours est requise.'],
    },
    subject: {
        type: String,
        required: [true, 'Le sujet (matière) est requis.'],
        trim: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'L\'ID du professeur est requis.'],
        ref: 'User', // Fait référence au modèle User
    },
    isLive: {
        type: Boolean,
        default: false,
    },
    startTime: {
        type: Date,
        // Requis seulement si isLive est vrai
        required: function() {
            return this.isLive;
        },
        message: 'L\'heure de début est requise pour un cours en direct.',
    },
    duration: {
        type: Number,
        required: [true, 'La durée est requise.'],
        min: [1, 'La durée doit être au moins 1 minute.'],
    },
    content: {
        type: [ContentBlockSchema], // Tableau des blocs de contenu
        required: [true, 'Le contenu du cours ne peut pas être vide.'],
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lesson', LessonSchema);