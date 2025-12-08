// server/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logActivity } = require('./activityController'); 

// Fonction utilitaire pour générer le token JWT
const generateToken = (id) => {
    // Assurez-vous que process.env.JWT_SECRET et JWT_EXPIRE sont définis dans votre .env
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE, 
    });
};

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => { 
    // CORRECTION: Inclure 'branch' pour la fonction registerUser
    const { name, email, password, role, branch } = req.body; 

    const userExists = await User.findOne({ email });

    if (userExists) {
        // Le message d'erreur en anglais sera capturé par le Front-end
        return res.status(400).json({ message: 'User already exists' }); 
    }

    // Le hachage du mot de passe est géré par le hook 'pre-save' dans le modèle User.js
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student', 
        branch: branch || 'Science', // Utilisation de 'branch' avec valeur par défaut
    });

    if (user) {
        logActivity(
            user._id, 
            user.name, 
            user.role, 
            'user_register', 
            `تم تسجيل حساب جديد.`,
            '/dashboard'
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            // Ajout de branch à la réponse pour la cohérence
            branch: user.branch 
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Authentifier un utilisateur & obtenir un token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Trouver l'utilisateur
    const user = await User.findOne({ email });

    // 2. Vérifier l'utilisateur ET le mot de passe
    // NOTE: user.matchPassword est la méthode définie dans le modèle User.js
    if (user && (await user.matchPassword(password))) {
        
        // Connexion réussie
        logActivity(
            user._id, 
            user.name, 
            user.role, 
            'user_login', 
            `تم تسجيل الدخول إلى لوحة التحكم بنجاح.`,
            '/dashboard'
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            // Ajout de branch à la réponse pour la cohérence
            branch: user.branch 
        });
    } else {
        // L'erreur est générée ici, envoyant le message au Front-end.
        res.status(401).json({ message: 'بيانات الإتصال خاطئة.' }); // Unauthorized
    }
};

module.exports = {
    registerUser,
    loginUser
};