// server/src/controllers/supportController.js
const SupportTicket = require('../models/SupportTicket');

// @desc    Créer un nouveau ticket de support
// @route   POST /api/support
// @access  Privé
exports.createTicket = async (req, res) => {
    const { subject, details, priority } = req.body;
    
    try {
        const ticket = await SupportTicket.create({
            user: req.user._id,
            subject,
            details,
            priority,
            status: 'open'
        });
        
        res.status(201).json({ message: 'Votre ticket a été créé avec succès (#MAD-' + ticket._id.toString().substring(0, 8).toUpperCase() + ').', ticket });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Obtenir tous les tickets créés par l'utilisateur
// @route   GET /api/support/mine
// @access  Privé
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user._id })
            .sort({ createdAt: -1 });
            
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};