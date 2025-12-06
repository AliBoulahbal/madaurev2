// server/routes/users.js

const express = require('express');
const { 
    registerUser, 
    loginUser, 
    getMe, 
    getAllTeachers,
    getAllUsers, 
    updateUserByAdmin, 
    deleteUser,
    createUserByAdmin // Importation de la nouvelle fonction Admin
} = require('../controllers/userController'); 
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// --- AUTHENTIFICATION ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// --- LISTES PUBLIQUES (pour les étudiants) ---
router.route('/teachers').get(protect, getAllTeachers);

// --- GESTION PAR L'ADMINISTRATEUR (CRUD sur /api/users) ---
// Obtenir la liste complète des utilisateurs (GET) et Créer un utilisateur (POST)
router.route('/')
    .get(protect, authorizeRoles(['admin']), getAllUsers)
    .post(protect, authorizeRoles(['admin']), createUserByAdmin); // Ajout de la route POST pour la création Admin

// Mettre à jour ou supprimer un utilisateur par ID (Admin seulement)
router.route('/:id')
    .put(protect, authorizeRoles(['admin']), updateUserByAdmin)
    .delete(protect, authorizeRoles(['admin']), deleteUser);

module.exports = router;