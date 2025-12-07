// server/controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');
const { logActivity } = require('./activityController'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => { // CORRECTION: Utilisation de 'const'
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
            role: 'student', 
            branch: branch || 'Science',
        });

        if (user) {
            logActivity(
                user._id, 
                user.name, 
                user.role, 
                'user_register', 
                `أنشأ حساباً جديداً بنجاح.`,
                '/dashboard'
            );

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
const loginUser = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            
            logActivity(
                user._id, 
                user.name, 
                user.role, 
                'user_login', 
                `تم تسجيل الدخول إلى لوحة التحكم بنجاح.`,
                '/dashboard'
            );

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                branch: user.branch,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => { // CORRECTION: Utilisation de 'const'
    res.status(200).json(req.user);
};

// @desc    Update authenticated user's profile (name, branch)
// @route   PUT /api/users/me
// @access  Private (User self-update)
const updateMyProfile = async (req, res) => { // NOUVELLE FONCTION
    const { name, branch } = req.body;
    const userId = req.user._id; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        // Mise à jour des champs autorisés
        if (name) user.name = name;
        if (branch) user.branch = branch;

        const updatedUser = await user.save();
        
        logActivity(
            userId,
            user.name,
            user.role,
            'user_profile_update',
            `قام بتحديث معلومات ملفه الشخصي (الإسم أو الشعبة).`,
            `/dashboard/subscription`
        );

        // Renvoyer les données mises à jour (sans mot de passe)
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            branch: updatedUser.branch,
        });

    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du profil: ' + error.message });
    }
};

// @desc    Get all users with role 'teacher'
// @route   GET /api/users/teachers
// @access  Private
const getAllTeachers = async (req, res) => { // CORRECTION: Utilisation de 'const'
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
const getAllUsers = async (req, res) => { // CORRECTION: Utilisation de 'const'
    try {
        const users = await User.find({}).select('-password'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a user by Admin (e.g., change role)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUserByAdmin = async (req, res) => { // CORRECTION: Utilisation de 'const'
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    if (req.params.id === req.user._id.toString()) {
        return res.status(403).json({ message: 'Impossible de modifier votre propre compte via cette route.' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        
        const { role, name, branch } = req.body;

        const fieldsToUpdate = {};
        if (role) fieldsToUpdate.role = role;
        if (name) fieldsToUpdate.name = name;
        if (branch) fieldsToUpdate.branch = branch;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        }).select('-password');
        
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'admin_user_update',
            `قام بتحديث حساب المستخدم ${updatedUser.name} (ID: ${updatedUser._id.toString().substring(0, 5)}...).`,
            `/admin/users`
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a user by Admin
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => { // CORRECTION: Utilisation de 'const'
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
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
        
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'admin_user_delete',
            `قام بحذف حساب المستخدم: ${userToDelete.name}.`,
            `/admin/users`
        );

        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create user by Admin (Admin only)
// @route   POST /api/users
// @access  Private (Admin)
const createUserByAdmin = async (req, res) => { 
    const { name, email, password, role, branch } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Veuillez ajouter tous les champs requis: nom, email, mot de passe, rôle.' });
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
            role: role, 
            branch: branch || null,
        });

        if (user) {
            logActivity(
                req.user._id, 
                req.user.name, 
                req.user.role, 
                'admin_user_create', 
                `أنشأ حساب المستخدم الجديد ${user.name} بنجاح.`,
                '/admin/users'
            );

            res.status(201).json({
                _id: user.id,
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


module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateMyProfile, // NOUVEL EXPORT
    getAllTeachers,
    getAllUsers,
    updateUserByAdmin,
    deleteUser,
    createUserByAdmin,
};