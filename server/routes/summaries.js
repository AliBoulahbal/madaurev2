// server/routes/summaries.js

const express = require('express');
const { 
    getAllSummaries, 
    createSummary, 
    updateSummary, 
    deleteSummary 
} = require('../controllers/summaryController');
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Public: Obtenir tous les résumés (GET /api/summaries)
// Cette route est accessible par tous les utilisateurs authentifiés
router.route('/').get(protect, getAllSummaries);

// Private (Teacher/Admin): Créer un nouveau résumé (POST /api/summaries)
// Cette route est celle qui manquait ou était mal définie
router.route('/').post(protect, authorizeRoles(['admin', 'teacher']), createSummary);

// Private (Teacher/Admin): Mettre à jour ou supprimer un résumé
router.route('/:id')
    .put(protect, authorizeRoles(['admin', 'teacher']), updateSummary)
    .delete(protect, authorizeRoles(['admin', 'teacher']), deleteSummary);

module.exports = router;