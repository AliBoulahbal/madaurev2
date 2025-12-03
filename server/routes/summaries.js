// server/src/routes/summaries.js

const express = require('express');
const { getSummaries, downloadSummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(protect, getSummaries);
router.route('/:id/download').get(protect, downloadSummary);

module.exports = router;