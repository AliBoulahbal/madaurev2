// server/routes/search.js

const express = require('express');
// CORRECTION : S'assurer que globalSearch est correctement importé
const { globalSearch } = require('../controllers/searchController'); 
const { protect } = require('../middleware/auth');
const router = express.Router();

// Route principale de recherche : /api/search?q=mot
router.route('/').get(protect, globalSearch);

module.exports = router;