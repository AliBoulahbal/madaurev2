// server/src/models/Subscription.js

const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    planName: {
        type: String,
        required: true,
        enum: ['Bronze', 'Silver', 'Gold', 'Annual'],
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
    },
    // ID de référence pour le paiement externe (Stripe, PayPal)
    externalSubscriptionId: { 
        type: String,
        default: null,
    }
}, {
    timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;