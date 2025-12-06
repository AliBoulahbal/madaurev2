// server/controllers/summaryController.js

const Summary = require('../models/Summary');
const mongoose = require('mongoose');

// @desc    Obtenir tous les résumés (pour la page /dashboard/summaries)
// @route   GET /api/summaries
// @access  Private
exports.getAllSummaries = async (req, res) => {
    try {
        const summaries = await Summary.find({})
                                        .populate('teacher', 'name email')
                                        .sort({ subject: 1, title: 1 });

        res.status(200).json(summaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Créer un nouveau résumé
// @route   POST /api/summaries
// @access  Private (Teacher/Admin)
exports.createSummary = async (req, res) => {
    // L'ID du professeur est disponible via req.user après le middleware protect
    const teacherId = req.user._id; 
    
    const { title, subject, fileUrl } = req.body;
    
    if (!title || !subject || !fileUrl) {
        return res.status(400).json({ message: "Veuillez fournir un titre, un sujet et une URL de fichier." });
    }

    try {
        const newSummary = await Summary.create({
            title,
            subject,
            fileUrl,
            teacher: teacherId, // Utiliser l'ID du professeur authentifié
        });

        res.status(201).json(newSummary);

    } catch (error) {
        console.error("Summary Creation Error:", error);
        if (error.name === 'ValidationError') {
             return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.errors 
            });
        }
        res.status(500).json({ message: "Échec de l'enregistrement du résumé." });
    }
};

// @desc    Mettre à jour un résumé
// @route   PUT /api/summaries/:id
// @access  Private (Teacher/Admin)
exports.updateSummary = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de résumé invalide' });
    }
    
    try {
        const updatedSummary = await Summary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedSummary) {
            return res.status(404).json({ message: 'Résumé non trouvé' });
        }

        res.status(200).json(updatedSummary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Supprimer un résumé
// @route   DELETE /api/summaries/:id
// @access  Private (Teacher/Admin)
exports.deleteSummary = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de résumé invalide' });
    }
    
    try {
        const result = await Summary.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Résumé non trouvé' });
        }

        res.status(200).json({ message: 'Résumé supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};