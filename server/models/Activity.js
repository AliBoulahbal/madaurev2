const mongoose = require('mongoose');

// Schéma pour enregistrer l'activité de l'utilisateur
const activitySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: { // Pour un affichage rapide sans jointure complexe
        type: String,
        required: true,
    },
    role: { // Rôle de l'utilisateur lors de l'activité
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student',
    },
    actionType: { // Type d'action (ex: 'lesson_completed', 'summary_downloaded', 'login', 'quiz_failed')
        type: String,
        required: true,
    },
    description: { // Description détaillée de l'activité (en arabe)
        type: String,
        required: true,
    },
    link: { // Lien optionnel vers la ressource associée
        type: String,
        default: '#',
    },
}, {
    timestamps: true, // Ajoute createdAt (date d'activité) et updatedAt
});

// Index pour optimiser la recherche par utilisateur et le tri
activitySchema.index({ userId: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;