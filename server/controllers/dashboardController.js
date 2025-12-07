// server/controllers/dashboardController.js

// Importation des modèles nécessaires pour les agrégations de statistiques
const Lesson = require('../models/Lesson');
const Summary = require('../models/Summary');
const Notification = require('../models/Notification');
const UserActivity = require('../models/UserActivity'); // Pour le suivi des leçons et téléchargements
const Communication = require('../models/Communication'); // Pour le suivi des interactions

// @desc    Obtenir les statistiques clés du tableau de bord
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => { // Correction de la syntaxe d'exportation
    try {
        const userId = req.user._id;

        // 1. Nombre de Leçons Complétées (réel via UserActivity)
        const lessonsCompleted = await UserActivity.countDocuments({
            user: userId,
            activityType: 'lesson_complete',
        });

        // 2. Nombre total de Résumés (PDF) téléchargés (réel via UserActivity)
        const totalDownloads = await UserActivity.countDocuments({
            user: userId,
            activityType: 'summary_download',
        });

        // 3. Temps d'étude (Simulé - nécessiterait un système de logging complexe en production)
        const userIdStr = userId.toString();
        // Utilise l'ID de l'utilisateur et le nombre de leçons pour une valeur unique et croissante
        const studyTime = (70 + (userIdStr.length % 20) + (lessonsCompleted * 0.5)).toFixed(1);

        // 4. Nombre d'interactions (messages envoyés par l'utilisateur aux professeurs)
        const teacherInteractions = await Communication.countDocuments({
            sender: userId,
        });

        // 5. Notifications non lues (pour la pastille dans la Sidebar)
        const unreadNotifications = await Notification.countDocuments({ 
            user: userId, 
            isRead: false 
        });

        // Renvoyer l'objet des statistiques au Frontend
        res.status(200).json({
            lessonsCompleted,
            totalDownloads,
            studyTime,
            teacherInteractions,
            unreadNotifications
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Erreur lors de l'obtention des statistiques du tableau de bord." });
    }
};

module.exports = {
    getDashboardStats,
};