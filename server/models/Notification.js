// server/src/models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // À qui s'adresse la notification
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['system', 'lesson', 'communication', 'subscription'],
        default: 'system',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String, // Lien vers la ressource associée (ex: /dashboard/live-lessons/123)
        default: null,
    }
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;