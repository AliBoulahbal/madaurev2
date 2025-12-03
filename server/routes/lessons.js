// server/src/routes/lessons.js

const express = require('express');
const { getLessons, createLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth'); // Nous allons créer ce middleware
const router = express.Router();

// Route pour l'obtention des leçons (accessible aux utilisateurs connectés)
router.route('/').get(protect, getLessons);

// Route pour la création de leçons (accessible uniquement aux profs/admins)
router.route('/').post(protect, createLesson);

module.exports = router;