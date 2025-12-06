// server/routes/support.js

const express = require('express');
const { submitTicket } = require('../controllers/supportController');
const { getAllFaq, createFaq } = require('../controllers/faqController');
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// --- Routes de Support (Tickets/Communication) ---

// Route pour soumettre un nouveau ticket de support
// En production, vous ajouteriez une validation de ticket robuste ici.
router.route('/ticket').post(protect, submitTicket);

// --- Routes de FAQ (Gestion par Admin) ---

// Route pour obtenir toutes les questions fréquentes (Accessible par tous les utilisateurs authentifiés)
router.route('/faq').get(protect, getAllFaq);

// Route pour qu'un Admin ajoute une nouvelle question fréquente
router.route('/faq').post(protect, authorizeRoles(['admin']), createFaq);

module.exports = router;