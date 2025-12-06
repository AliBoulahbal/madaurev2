// server/controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user (Public, Student by default)
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

        // Le rôle est TOUJOURS 'student' par cette route publique
        const user = await User.create({
            name,
            email,
            password, // Mongoose pre-save middleware hache le mot de passe
            role: 'student', 
            branch: branch || 'General',
        });

        if (user) {
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

// --- NOUVELLE FONCTION ADMIN D'AJOUT ---

// @desc    Create new user with specified role (Admin only)
// @route   POST /api/users
// @access  Private (Admin)
exports.createUserByAdmin = async (req, res) => {
    const { name, email, password, role, branch } = req.body;

    // L'Admin doit spécifier tous les champs
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Veuillez ajouter tous les champs requis (nom, email, mot de passe, rôle).' });
    }
    
    // Validation simple du rôle
    if (!['student', 'teacher', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Rôle spécifié invalide.' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }
        
        // Création de l'utilisateur avec le rôle spécifié par l'Admin
        const user = await User.create({
            name,
            email,
            password, // Le hachage est géré par le middleware pre-save
            role: role, 
            branch: branch || 'General',
        });

        if (user) {
            // Retourner les informations de l'utilisateur sans le mot de passe
            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès.',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
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
        // Remplacez 'User.findOne({ email })' si le mot de passe n'est pas sélectionné
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Identifiants invalides' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    // req.user est déjà défini par le middleware 'protect'
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
    
    // Admin ne peut pas modifier son propre rôle ou supprimer son propre compte (règle non implémentée, mais bonne pratique)
    if (req.params.id === req.user._id.toString()) {
        if (req.body.role) {
             return res.status(403).json({ message: 'Impossible de modifier votre propre rôle via cette route.' });
        }
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // Mettre à jour seulement les champs autorisés par l'Admin (rôle, nom, branche, etc.)
        const { role, name, branch, password } = req.body;

        const fieldsToUpdate = {};
        if (role) fieldsToUpdate.role = role;
        if (name) fieldsToUpdate.name = name;
        if (branch) fieldsToUpdate.branch = branch;
        // La modification du mot de passe doit être gérée par un processus séparé si nécessaire
        // Si le mot de passe est fourni, le hacher avant la mise à jour
        if (password) {
            const salt = await bcrypt.genSalt(10);
            fieldsToUpdate.password = await bcrypt.hash(password, salt);
        }


        const updatedUser = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        }).select('-password');

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
    
    if (req.params.id === req.user._id.toString()) {
        return res.status(403).json({ message: 'Impossible de supprimer votre propre compte via cette route.' });
    }

    try {
        const result = await User.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};