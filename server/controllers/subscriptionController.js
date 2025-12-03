// server/src/controllers/subscriptionController.js
const Subscription = require('../models/Subscription');

// @desc    Obtenir l'abonnement actif de l'utilisateur
// @route   GET /api/subscriptions/mine
// @access  Privé (Étudiant)
exports.getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ 
            user: req.user._id,
            status: 'active'
        });

        if (!subscription) {
            return res.status(404).json({ message: 'No active subscription found' });
        }

        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Créer un nouvel abonnement (Placeholder pour paiement)
// @route   POST /api/subscriptions/checkout
// @access  Privé (Étudiant)
exports.createSubscription = async (req, res) => {
    const { planName, endDate } = req.body;
    
    try {
        // En prod, on validerait le paiement ici avant de créer la ressource
        await Subscription.updateMany({ user: req.user._id, status: 'active' }, { status: 'expired' });

        const newSubscription = await Subscription.create({
            user: req.user._id,
            planName,
            endDate,
            status: 'active',
        });

        res.status(201).json({ 
            message: `Abonnement '${planName}' créé avec succès.`, 
            subscription: newSubscription 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};