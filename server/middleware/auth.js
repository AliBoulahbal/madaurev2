// server/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            // Console log pour le débogage (peut être retiré en prod)
            // console.log(`[AUTH] Token reçu: ${token.substring(0, 10)}...`); 

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.warn('[AUTH] Utilisateur non trouvé pour ce token décodé.');
                res.status(401).json({ message: 'Not authorized, user not found' });
                return;
            }
            
            // console.log(`[AUTH] Utilisateur ID: ${req.user._id} authentifié.`);
            next();

        } catch (error) {
            console.error('[AUTH] Erreur de décodage JWT ou Token expiré:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        // console.warn('[AUTH] Pas de token trouvé dans l\'en-tête Authorization.');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware pour restreindre l'accès à certains rôles.
 * @param {Array<string>} roles - Tableau des rôles autorisés (e.g., ['admin', 'teacher'])
 */
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        // Vérifie si l'utilisateur est authentifié et si son rôle est inclus dans les rôles autorisés
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden: User role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource.` });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };