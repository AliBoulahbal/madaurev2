// server/controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');
// Importation de la fonction logActivity depuis le nouveau contrôleur
const { logActivity } = require('./activityController'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { name, email, password, branch } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Veuillez ajouter tous les champs requis' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Utilisateur existe déjà' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'student', // Rôle par défaut
            branch: branch || 'Science',
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
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Données utilisateur invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // NOTE: Dans votre modèle User.js, 'matchPassword' est une méthode d'instance qui compare les mots de passe hachés.
        if (user && (await user.matchPassword(password))) {
            
            // --- ENREGISTREMENT DE L'ACTIVITÉ ---
            // 1. Appel de logActivity APRES la connexion réussie
            logActivity(
                user._id, 
                user.name, 
                user.role, 
                'user_login', // Type d'action
                `تم تسجيل الدخول إلى لوحة التحكم بنجاح.`, // Description en arabe
                '/dashboard' // Lien vers le tableau de bord
            );
            // -------------------------------------

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                token: generateToken(user._id),
            });
        } else {
            // Le message d'erreur est ajusté pour correspondre à votre fragment précédent
            res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get all users with role 'teacher'
// @route   GET /api/users/teachers
// @access  Private
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password -__v');
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- FONCTIONS ADMINISTATION UTILISATEURS ---

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        // Exclure le mot de passe pour la sécurité
        const users = await User.find({}).select('-password'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a user by Admin (e.g., change role)
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUserByAdmin = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    // Règle de sécurité: Admin ne peut pas modifier son propre compte via cette route.
    if (req.params.id === req.user._id.toString()) {
        return res.status(403).json({ message: 'Impossible de modifier votre propre compte via cette route.' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // Mettre à jour seulement les champs autorisés par l'Admin (rôle, nom, branche, etc.)
        const { role, name, branch } = req.body;

        const fieldsToUpdate = {};
        if (role) fieldsToUpdate.role = role;
        if (name) fieldsToUpdate.name = name;
        if (branch) fieldsToUpdate.branch = branch;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        }).select('-password');
        
        // --- LOG ACTIVITÉ : Mise à jour par Admin ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'admin_user_update',
            `قام بتحديث حساب المستخدم ${updatedUser.name} (ID: ${updatedUser._id.toString().substring(0, 5)}...).`,
            `/admin/users`
        );
        // ------------------------------------------

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a user by Admin
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    // Règle de sécurité: Admin ne peut pas supprimer son propre compte via cette route.
    if (req.params.id === req.user._id.toString()) {
        return res.status(403).json({ message: 'Impossible de supprimer votre propre compte via cette route.' });
    }

    try {
        const userToDelete = await User.findById(req.params.id);
        
        if (!userToDelete) {
             return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        const result = await User.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // --- LOG ACTIVITÉ : Suppression par Admin ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'admin_user_delete',
            `قام بحذف حساب المستخدم: ${userToDelete.name}.`,
            `/admin/users`
        );
        // ------------------------------------------

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};