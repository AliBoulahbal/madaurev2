// server/src/controllers/userController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription'); // Nécessaire pour le profil

// @desc    Obtenir la liste de tous les professeurs (Rôle 'teacher')
// @route   GET /api/teachers
// @access  Privé (Tous les utilisateurs connectés)
exports.getTeachers = async (req, res) => {
    try {
        // Sélectionne uniquement les utilisateurs avec le rôle 'teacher'
        const teachers = await User.find({ role: 'teacher' }).select('-password -__v');
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/users/profile
// @access  Privé
exports.getUserProfile = async (req, res) => {
    try {
        // req.user est défini par le middleware protect
        const user = await User.findById(req.user._id).select('-password');
        
        if (user) {
            // Récupère l'abonnement actif pour afficher l'état
            const subscription = await Subscription.findOne({ user: user._id, status: 'active' });

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isSubscribed: !!subscription,
                subscriptionDetails: subscription || null,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ... (Ajouter la fonction updateProfile si besoin)