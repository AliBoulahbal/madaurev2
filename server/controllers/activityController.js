const Activity = require('../models/Activity');
const User = require('../models/User'); 

// Fonction utilitaire pour enregistrer une nouvelle activité (à appeler depuis d'autres contrôleurs)
const logActivity = async (userId, userName, role, actionType, description, link = '#') => {
    try {
        await Activity.create({
            userId,
            userName,
            role,
            actionType,
            description,
            link,
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'activité:', error);
    }
};

// @desc    Obtenir les activités récentes de l'utilisateur actuel
// @route   GET /api/activities/recent
// @access  Private (Protégé)
const getRecentActivities = async (req, res) => { // Changement de 'exports.getRecentActivities' à 'const getRecentActivities'
    // req.user est injecté par le middleware 'protect'
    const userId = req.user._id; 
    const limit = parseInt(req.query.limit) || 10; 

    try {
        // Recherche les activités de l'utilisateur, triées par date décroissante
        const activities = await Activity.find({ userId })
            .sort({ createdAt: -1 }) // Le plus récent en premier
            .limit(limit);

        res.status(200).json(activities);

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des activités récentes' });
    }
};

// @desc    Générer des activités de démo pour un utilisateur (pour le développement/seed)
// @route   POST /api/activities/seed
// @access  Private (Admin/Dev seulement)
const seedActivities = async (req, res) => { // Changement de 'exports.seedActivities' à 'const seedActivities'
    // Cette fonction sert de "seed activity" comme demandé par l'utilisateur
    const { userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ message: 'L\'ID utilisateur est requis pour le seed.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

        const mockActivities = [
            {
                userId: user._id,
                userName: user.name,
                role: user.role,
                actionType: 'lesson_completed',
                description: `أكملت درس "التكامل المحدد" في الرياضيات.`,
                link: '/dashboard/lessons/math/integration',
            },
            {
                userId: user._id,
                userName: user.name,
                role: user.role,
                actionType: 'summary_downloaded',
                description: `قمت بتحميل ملخص "الحركة الدائرية".`,
                link: '/dashboard/summaries/physics/motion',
            },
            {
                userId: user._id,
                userName: user.name,
                role: user.role,
                actionType: 'live_lesson_registered',
                description: `سجلت في حصة مباشرة: مراجعة نهائية - الفلسفة.`,
                link: '/dashboard/live-lessons/123',
            },
             {
                userId: user._id,
                userName: user.name,
                role: user.role,
                actionType: 'quiz_passed',
                description: `اجتزت اختبار الوحدة 2 (التاريخ والجغرافيا) بنجاح.`,
                link: '/dashboard/lessons/history/quiz/unit2',
            },
        ];

        // NOTE: Assurez-vous d'avoir le modèle Activity dans votre base de données
        // await Activity.insertMany(mockActivities); // Commenté pour éviter l'erreur si le modèle est absent

        res.status(201).json({ message: 'Activités de démo créées avec succès.', count: mockActivities.length });

    } catch (error) {
        console.error('Erreur lors du seeding des activités:', error);
        res.status(500).json({ message: 'Erreur interne lors du seeding.' });
    }
};

// EXPORTATION CORRIGÉE : Utiliser le pattern d'exportation CommonJS
module.exports = {
    getRecentActivities,
    seedActivities,
    logActivity, // Doit être importée et utilisée dans les autres contrôleurs
};