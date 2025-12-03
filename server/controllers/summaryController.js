// server/src/controllers/summaryController.js

const Summary = require('../models/Summary');

// @desc    Get all summaries (for students)
// @route   GET /api/summaries
// @access  Private (All Users)
exports.getSummaries = async (req, res) => {
    try {
        const summaries = await Summary.find({})
            .populate('teacher', 'name subject')
            .sort({ createdAt: -1 });
            
        res.status(200).json(summaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Increment download count and redirect to file (for students)
// @route   GET /api/summaries/:id/download
// @access  Private (All Users)
exports.downloadSummary = async (req, res) => {
    try {
        const summary = await Summary.findById(req.params.id);
        
        if (summary) {
            // Incrémenter le compteur de téléchargements
            summary.downloadsCount += 1;
            await summary.save();
            
            // Rediriger vers l'URL du fichier (implique que le fichier est stocké ailleurs)
            res.redirect(summary.fileUrl); 
        } else {
            res.status(404).json({ message: 'Summary not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// TODO: Ajouter createSummary (Teacher/Admin) et deleteSummary