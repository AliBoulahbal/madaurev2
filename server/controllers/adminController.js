// server/controllers/adminController.js

const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Summary = require('../models/Summary');
const Subscription = require('../models/Subscription');
// Importation optionnelle de logActivity

// @desc    Obtenir les statistiques globales pour le Dashboard Admin/Teacher
// @route   GET /api/admin/stats
// @access  Private (Admin/Teacher)
const getAdminStats = async (req, res) => { // Correction de la syntaxe d'exportation
    try {
        // 1. Statistiques des Utilisateurs
        const totalUsers = await User.countDocuments({});
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });

        // 2. Statistiques du Contenu
        const totalLessons = await Lesson.countDocuments({ status: { $ne: 'cancelled' } });
        const totalSummaries = await Summary.countDocuments({});

        // 3. Statistiques d'Abonnement
        const totalActiveSubscriptions = await Subscription.countDocuments({ status: 'active' });
        
        // 4. Statistiques d'Activité (Basées sur les leçons complétées pour la simulation)
        const lessonsCompleted = await Lesson.countDocuments({ status: 'completed' });
        const avgCompletionRate = totalLessons > 0 ? (lessonsCompleted / totalLessons * 100).toFixed(1) : 0;


        res.status(200).json({
            users: {
                totalUsers,
                totalStudents,
                totalTeachers,
            },
            content: {
                totalLessons,
                totalSummaries,
                lessonsCompleted: lessonsCompleted,
                avgCompletionRate: parseFloat(avgCompletionRate),
            },
            subscriptions: {
                totalActiveSubscriptions,
            }
        });

    } catch (error) {
        console.error("Admin Stats Fetch Error (from adminController):", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des statistiques administratives." });
    }
};

module.exports = {
    getAdminStats,
};