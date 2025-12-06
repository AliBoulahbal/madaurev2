// server/routes/subscriptions.js

const express = require('express');
const { getMySubscription, createSubscription, validateToken } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/mine').get(protect, getMySubscription);
router.route('/checkout').post(protect, createSubscription);

// NOUVELLE ROUTE : Activation du Token
router.route('/validateToken').post(protect, validateToken); 

module.exports = router;