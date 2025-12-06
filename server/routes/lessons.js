// server/routes/lessons.js

const express = require('express');
const { 
    createLesson, 
    getAllLessons, 
    getLessonById, 
    updateLesson, 
    deleteLesson 
} = require('../controllers/lessonController');
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Public: Route pour récupérer toutes les leçons (accessibles par les étudiants)
router.route('/').get(protect, getAllLessons); 

// Private (Teacher/Admin): Route pour créer une nouvelle leçon
router.route('/').post(protect, authorizeRoles(['admin', 'teacher']), createLesson);

// Route pour obtenir, mettre à jour ou supprimer une leçon spécifique
router.route('/:id')
    .get(protect, getLessonById)
    .put(protect, authorizeRoles(['admin', 'teacher']), updateLesson)
    .delete(protect, authorizeRoles(['admin', 'teacher']), deleteLesson);

module.exports = router;