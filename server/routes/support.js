// server/src/routes/support.js
const express = require('express');
const { createTicket, getMyTickets } = require('../controllers/supportController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').post(protect, createTicket);
router.route('/mine').get(protect, getMyTickets);

module.exports = router;