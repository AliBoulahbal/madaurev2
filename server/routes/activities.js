const express = require('express');
const { getRecentActivities, seedActivities } = require('../controllers/activityController'); 
const { protect, authorizeRoles } = require('../middleware/auth'); // Assumer ces middlewares existent
const router = express.Router();

// @route   GET /api/activities/recent
// @desc    Obtenir l'activité récente pour l'utilisateur connecté
// @access  Private
router.get('/recent', protect, getRecentActivities);

// @route   POST /api/activities/seed
// @desc    Endpoint de seed (pour les tests)
// @access  Private (Admin seulement)
router.post('/seed', protect, authorizeRoles(['admin']), seedActivities);

module.exports = router;

// NOTE IMPORTANTE: N'oubliez pas d'ajouter cette route à votre fichier principal d'application (ex: server.js ou app.js)
// Exemple: app.use('/api/activities', require('./routes/activities'));