// server/src/controllers/notificationController.js
const Notification = require('../models/Notification');

// @desc    Obtenir les 50 dernières notifications de l'utilisateur
// @route   GET /api/notifications
// @access  Privé
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 }) // Les plus récentes d'abord
            .limit(50);
            
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/notifications/:id/read
// @access  Privé
exports.markAsRead = async (req, res) => {
    try {
        // Recherche et mise à jour, en s'assurant que la notification appartient bien à l'utilisateur
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, 
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or not owned by user' });
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};