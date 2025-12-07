// server/src/controllers/notificationController.js
const Notification = require('../models/Notification');
// Importation optionnelle de logActivity. Si vous l'utilisez, assurez-vous de l'importer :
// const { logActivity } = require('./activityController'); 

// @desc    Obtenir les 50 dernières notifications de l'utilisateur
// @route   GET /api/notifications
// @access  Privé
const getUserNotifications = async (req, res) => { // CORRECTION: Utilisation de 'const'
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
const markAsRead = async (req, res) => { // CORRECTION: Utilisation de 'const'
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
        
        // Log activity peut être ajouté ici si le marquage comme lu est considéré comme une activité importante
        
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
};