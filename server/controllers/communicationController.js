const mongoose = require('mongoose');
const Communication = require('../models/Communication');
const User = require('../models/User'); 
// Importation de la fonction logActivity
const { logActivity } = require('./activityController'); 

// @desc    Envoyer un nouveau message ou une réponse
// @route   POST /api/communication/send
// @access  Private
const sendMessage = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const { recipientId, subject, body, parentMessageId } = req.body;
    const sender = req.user._id;
    const senderName = req.user.name;
    const senderRole = req.user.role;

    if (!recipientId || !body) {
        return res.status(400).json({ message: "Veuillez fournir un destinataire et un contenu." });
    }
    
    // Vérification basique du destinataire
    const recipient = await User.findById(recipientId).select('name role');
    if (!recipient) {
         return res.status(404).json({ message: "Destinataire non trouvé." });
    }

    try {
        const newMessage = await Communication.create({
            sender,
            recipient: recipientId,
            subject: parentMessageId ? undefined : subject,
            body,
            parentMessage: parentMessageId,
            isRead: false, // Marqué comme non lu pour le destinataire
        });

        // --- LOG ACTIVITÉ : Envoi de message ---
        if (senderRole === 'student' && recipient.role === 'teacher') {
            logActivity(
                sender,
                senderName,
                senderRole,
                'communication_message_sent',
                `أرسل رسالة جديدة إلى الأستاذ ${recipient.name} بخصوص ${subject || 'موضوع سابق'}.`,
                `/dashboard/communication`
            );
        }
        // -------------------------------------

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir la liste des conversations de l'utilisateur
// @route   GET /api/communication/threads
// @access  Private
const getConversations = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const userId = req.user._id;

    try {
        const threads = await Communication.find({
            $or: [{ sender: userId }, { recipient: userId }],
            parentMessage: { $exists: false } // Sélectionne uniquement les messages initiaux
        })
        .sort({ createdAt: -1 })
        .populate('sender', 'name role')
        .populate('recipient', 'name role');

        res.status(200).json(threads);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir les messages dans un thread (par ID du message initial)
// @route   GET /api/communication/thread/:id
// @access  Private
const getThreadMessages = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const threadId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(threadId)) {
        return res.status(400).json({ message: 'ID de thread invalide' });
    }

    try {
        const messages = await Communication.find({
            $or: [{ _id: threadId }, { parentMessage: threadId }],
            $or: [{ sender: userId }, { recipient: userId }] 
        })
        .sort({ createdAt: 1 }) // Du plus ancien au plus récent
        .populate('sender', 'name role')
        .populate('recipient', 'name role');

        if (messages.length === 0) {
            return res.status(404).json({ message: 'Conversation non trouvée.' });
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Marquer un message ou un thread comme lu
// @route   PUT /api/communication/:id/read
// @access  Private
const markAsRead = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const messageId = req.params.id;
    const userId = req.user._id;

    try {
        const message = await Communication.findOneAndUpdate(
            { _id: messageId, recipient: userId, isRead: false }, 
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: 'Message non trouvé ou déjà lu.' });
        }

        res.status(200).json({ message: 'Message marqué comme lu.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    sendMessage,
    getConversations,
    getThreadMessages,
    markAsRead,
};