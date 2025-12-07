// server/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Importation de la fonction logActivity
const { logActivity } = require('./activityController'); 
const bcrypt = require('bcryptjs'); // Assurez-vous d'importer bcryptjs si non géré par le modèle

// Fonction utilitaire pour générer le token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // NOTE: Si le hachage n'est pas géré par un hook 'pre-save' dans le modèle User.js, vous devriez le faire ici.
        // Puisque le modèle User.js que vous avez fourni inclut un hook pre-save, nous créons directement.
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student', 
        });

        if (user) {
            // --- LOG ACTIVITÉ : Enregistrement réussi ---
            logActivity(
                user._id, 
                user.name, 
                user.role, 
                'user_register', 
                `أنشأ حساباً جديداً بنجاح.`,
                '/dashboard'
            );
            // ------------------------------------------

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
         res.status(500).json({ message: error.message });
    }
};

// @desc    Authentifier un utilisateur & obtenir un token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // NOTE: Utilisation de la méthode matchPassword du modèle User.js (qui utilise bcrypt)
        if (user && (await user.matchPassword(password))) {
            
            // --- LOG ACTIVITÉ : Connexion réussie ---
            logActivity(
                user._id, 
                user.name, 
                user.role, 
                'user_login', 
                `تم تسجيل الدخول إلى لوحة التحكم بنجاح.`,
                '/dashboard'
            );
            // --------------------------------------

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// EXPORTATION CORRIGÉE : Utiliser le pattern d'exportation CommonJS
module.exports = {
    registerUser,
    loginUser,
};