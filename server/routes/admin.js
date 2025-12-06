// server/routes/admin.js

const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Route pour obtenir les statistiques globales du tableau de bord Admin
// Cette route nécessite une authentification (protect) et les rôles Admin ou Teacher (authorizeRoles)
router.route('/stats').get(protect, authorizeRoles(['admin', 'teacher']), getAdminStats);

// Vous pouvez ajouter d'autres routes de gestion ici plus tard (e.g., /admin/users, /admin/summaries)

module.exports = router;