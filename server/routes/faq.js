// server/src/routes/faq.js
const express = require('express');
const { getFAQs } = require('../controllers/faqController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(protect, getFAQs);

module.exports = router;