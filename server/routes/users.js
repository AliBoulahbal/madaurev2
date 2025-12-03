// server/src/routes/users.js
const express = require('express');
const { getTeachers, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Routes générales pour l'utilisateur
router.route('/profile').get(protect, getUserProfile);

// Route spécifique pour la page des professeurs (utilisera /api/teachers)
router.route('/teachers').get(protect, getTeachers); 

module.exports = router;