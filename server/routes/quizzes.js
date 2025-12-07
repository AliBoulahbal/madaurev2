const express = require('express');
const { createQuiz, getQuizById, submitQuiz } = require('../controllers/quizController'); 
const { protect, authorizeRoles } = require('../middleware/auth'); // Assumer ces middlewares existent
const router = express.Router();

// Route pour la création de quiz (Admin/Teacher)
router.post('/', protect, authorizeRoles(['admin', 'teacher']), createQuiz);

// Route pour obtenir un quiz (sans les réponses)
router.get('/:id', protect, getQuizById);

// Route pour soumettre les réponses et obtenir le score (Déclenche logActivity)
router.post('/:id/submit', protect, submitQuiz); 

module.exports = router;

// NOTE IMPORTANTE: N'oubliez pas d'ajouter cette route à votre fichier principal d'application (ex: server.js)
// Exemple: app.use('/api/quizzes', require('./routes/quizzes'));