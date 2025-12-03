// server/src/controllers/faqController.js
const FAQ = require('../models/FAQ');

// @desc    Obtenir toutes les questions/réponses de la FAQ
// @route   GET /api/faq
// @access  Privé (Tous les utilisateurs connectés)
exports.getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({})
            .sort({ order: 1, category: 1 });
            
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// NOTE: Le code pour la création, la modification et la suppression (Admin) est omis pour la concision.