// server/routes/users.js

const express = require('express');
const { 
    registerUser, 
    loginUser, 
    getMe, 
    // NOUVELLE IMPORTATION : Fonction permettant à l'utilisateur de mettre à jour son propre profil
    updateMyProfile, 
    getAllTeachers,
    getAllUsers, 
    updateUserByAdmin, 
    deleteUser,
    createUserByAdmin // Importation de la fonction Admin
} = require('../controllers/userController'); 
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// --- AUTHENTIFICATION / PROFIL UTILISATEUR ---\r\n
router.post('/register', registerUser);
router.post('/login', loginUser);

// Route pour obtenir (GET) et mettre à jour (PUT) les données de l'utilisateur connecté (/api/users/me)
router.route('/me')
    .get(protect, getMe)
    .put(protect, updateMyProfile); // Ajout de la route PUT protégée

// --- LISTES PUBLIQUES (pour les étudiants) ---\r\n
router.route('/teachers').get(protect, getAllTeachers);

// --- GESTION PAR L'ADMINISTRATEUR (CRUD sur /api/users) ---\r\n
// Obtenir la liste complète des utilisateurs (GET) et Créer un utilisateur (POST)
router.route('/')
    .get(protect, authorizeRoles(['admin']), getAllUsers)
    .post(protect, authorizeRoles(['admin']), createUserByAdmin); 

// Mettre à jour ou supprimer un utilisateur par ID (Admin seulement)\r\n
router.route('/:id')
    .put(protect, authorizeRoles(['admin']), updateUserByAdmin)
    .delete(protect, authorizeRoles(['admin']), deleteUser);

module.exports = router;