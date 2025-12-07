const mongoose = require('mongoose');

// Schéma pour les conversations (messages)
const communicationSchema = mongoose.Schema({
    sender: { // Utilisateur qui envoie le message
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: { // Utilisateur qui reçoit le message (généralement un professeur)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: { // Sujet du thread (pour le premier message)
        type: String,
        trim: true,
        required: function() { return !this.parentMessage; } // Requis uniquement si ce n'est pas une réponse
    },
    body: { // Contenu du message
        type: String,
        required: true,
    },
    parentMessage: { // ID du message précédent ou du thread
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Communication',
        required: false,
    },
    isRead: { // Statut de lecture par le destinataire
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Communication = mongoose.model('Communication', communicationSchema);

module.exports = Communication;