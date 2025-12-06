// server/controllers/subscriptionController.js

const Subscription = require('../models/Subscription');
const Token = require('../models/Token'); // Modèle pour les tokens d'activation
const User = require('../models/User'); // Pour mettre à jour l'utilisateur après activation

// @desc    Obtenir l'abonnement actif de l'utilisateur
// @route   GET /api/subscriptions/mine
// @access  Private (Étudiant)
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

// @desc    Créer un nouvel abonnement (Placeholder pour un checkout standard)
// @route   POST /api/subscriptions/checkout
// @access  Private (Étudiant)
exports.createSubscription = async (req, res) => {
    // Cette fonction sert de placeholder pour un mode d'achat autre que le token.
    const { planName, endDate } = req.body;
    
    try {
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


// @desc    Valider et consommer un token d'activation (Implémentation de la logique Token)
// @route   POST /api/subscriptions/validateToken
// @access  Private (accessible après login)
exports.validateToken = async (req, res) => {
    const { soldToken, deviceId } = req.body;
    
    if (!soldToken || !deviceId) {
        return res.status(400).json({ status: "MISSING REQUIRED FIELDS", message: "Code token et ID appareil requis." });
    }

    if (!req.user || !req.user._id) {
         return res.status(401).json({ status: "UNAUTHORIZED", message: "Authentification requise pour activer le token." });
    }
    
    const currentUserId = req.user._id.toString();

    try {
        // 1. Trouver le token dans la DB
        const tokenDoc = await Token.findOne({ tokenCode: soldToken });

        if (!tokenDoc) {
            return res.status(400).json({ status: "INVALID SOLD TOKEN", message: "Code token invalide." });
        }
        
        // 2. Vérifier si le token a expiré
        if (tokenDoc.contractExpirationDate < new Date()) { 
            return res.status(400).json({ status: "EXPIRED CONTRACT", message: "Le contrat associé à ce token a expiré." });
        }
        
        // 3. Vérifier si le token est déjà consommé
        if (tokenDoc.isConsumed) {
            if (tokenDoc.assignedToUser && tokenDoc.assignedToUser.toString() !== currentUserId) {
                 return res.status(400).json({ status: "ALREADY USED", message: "Ce token est déjà utilisé par un autre utilisateur." });
            }
            return res.status(400).json({ status: "ALREADY ACTIVE", message: "Ce token est déjà actif pour votre compte." });
        }

        // --- 4. Activation et Consommation du Token ---
        
        // a) Annuler les anciens abonnements actifs
        await Subscription.updateMany({ user: currentUserId, status: 'active' }, { status: 'expired' });
        
        const newSubscription = await Subscription.create({
            user: currentUserId,
            planName: "Token Access", // Maintenant valide grâce à la mise à jour du modèle
            endDate: tokenDoc.contractExpirationDate,
            status: 'active',
        });
        
        // b) Marquer le token comme consommé
        console.log(`[TOKEN CONSUMPTION] Marking token ${soldToken} as consumed.`); // Log de vérification
        tokenDoc.isConsumed = true;
        tokenDoc.assignedToUser = currentUserId;
        await tokenDoc.save(); // <-- Cette ligne va mettre à jour le statut dans la BD

        // c) Mettre à jour l'utilisateur (deviceId)
        await User.findByIdAndUpdate(currentUserId, { deviceId: deviceId }); 
        
        res.status(200).json({ 
            status: "SUCCESS", 
            message: "Activation réussie. Votre abonnement est actif.",
            subscription: newSubscription
        });

    } catch (error) {
        // En cas d'erreur inattendue
        console.error("Token Validation Fatal Error:", error);
        // On envoie un message d'erreur clair pour le Front-end
        res.status(500).json({ status: "INTERNAL_ERROR", error: "Erreur interne du serveur lors de l'activation. Vérifiez la console pour les détails." }); 
    }
};