// server/src/routes/subscriptions.js
const express = require('express');
const { getMySubscription, createSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/mine').get(protect, getMySubscription);
router.route('/checkout').post(protect, createSubscription);

module.exports = router;