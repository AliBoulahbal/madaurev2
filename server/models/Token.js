// server/models/Token.js

const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    tokenCode: {
        type: String,
        required: true,
        unique: true,
    },
    // Le token est marqué comme utilisé après l'inscription
    isConsumed: {
        type: Boolean,
        default: false,
    },
    // L'ID de l'utilisateur auquel le token a été attribué
    assignedToUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    // Le contrat de service (pour vérifier EXPIRED CONTRACT)
    contractExpirationDate: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;