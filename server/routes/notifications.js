// server/src/routes/notifications.js
const express = require('express');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(protect, getUserNotifications);
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;