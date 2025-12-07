const express = require('express');
const { sendMessage, getConversations, getThreadMessages, markAsRead } = require('../controllers/communicationController'); 
const { protect } = require('../middleware/auth'); // Assumer ce middleware existe
const router = express.Router();

// @route   POST /api/communication/send
// @desc    Envoyer un message (déclenche logActivity pour les étudiants)
// @access  Private
router.post('/send', protect, sendMessage);

// @route   GET /api/communication/threads
// @desc    Obtenir la liste des conversations principales
// @access  Private
router.get('/threads', protect, getConversations);

// @route   GET /api/communication/thread/:id
// @desc    Obtenir tous les messages d'un thread
// @access  Private
router.get('/thread/:id', protect, getThreadMessages);

// @route   PUT /api/communication/:id/read
// @desc    Marquer un message comme lu
// @access  Private
router.put('/:id/read', protect, markAsRead);

module.exports = router;

// NOTE IMPORTANTE: N'oubliez pas d'ajouter cette route à votre fichier principal d'application (ex: server.js)
// Exemple: app.use('/api/communication', require('./routes/communication'));