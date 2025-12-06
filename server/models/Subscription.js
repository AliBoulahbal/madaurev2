// server/models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planName: {
        type: String,
        required: true,
        // ** CORRECTION CLÉ : Ajouter la valeur 'Token Access' à l'énumération **
        enum: ['Basic', 'Premium', 'Token Access', 'Trial'], 
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active',
    }
}, {
    timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;