// server/controllers/summaryController.js

const Summary = require('../models/Summary');
const mongoose = require('mongoose');
// Importation de la fonction logActivity
const { logActivity } = require('./activityController'); 


// @desc    Obtenir tous les résumés (pour la page /dashboard/summaries)
// @route   GET /api/summaries
// @access  Private
const getAllSummaries = async (req, res) => { // CORRECTION: Utilisation de 'const'
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
const createSummary = async (req, res) => { // CORRECTION: Utilisation de 'const'
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
        
        // --- LOG ACTIVITÉ : Création de Résumé par Admin/Teacher ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'content_summary_create',
            `أضاف الملخص الجديد: "${newSummary.title}" (${newSummary.subject}).`,
            `/admin/summaries/${newSummary._id}`
        );
        // --------------------------------------------------------

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

// @desc    Générer un lien de téléchargement pour un résumé (ACTION ÉTUDIANT)
// @route   GET /api/summaries/:id/download
// @access  Private
const downloadSummary = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const summaryId = req.params.id;
    const userId = req.user._id;
    const userName = req.user.name;
    const userRole = req.user.role;

    try {
        const summary = await Summary.findById(summaryId);

        if (!summary) {
            return res.status(404).json({ message: 'Résumé non trouvé.' });
        }
        
        // **********************************************
        // LOGIQUE D'ENREGISTREMENT DE L'ACTIVITÉ
        // **********************************************
        logActivity(
            userId,
            userName,
            userRole,
            'summary_downloaded', 
            `قمت بتحميل ملخص "${summary.title}" في مادة ${summary.subject}.`, 
            `/dashboard/summaries/${summaryId}`
        );
        // **********************************************

        // NOTE: Logique réelle pour la gestion du téléchargement (envoi du fichier, etc.)
        
        res.status(200).json({ 
            message: 'Téléchargement initié et activité مسجلة.',
            downloadUrl: summary.fileUrl 
        });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du téléchargement du résumé.' });
    }
};


// @desc    Mettre à jour un résumé
// @route   PUT /api/summaries/:id
// @access  Private (Teacher/Admin)
const updateSummary = async (req, res) => { // CORRECTION: Utilisation de 'const'
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de résumé invalide' });
    }
    
    try {
        const updatedSummary = await Summary.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updatedSummary) {
            return res.status(404).json({ message: 'Résumé non trouvé' });
        }
        
        // --- LOG ACTIVITÉ : Mise à jour par Admin/Teacher ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'content_summary_update',
            `قام بتحديث الملخص: "${updatedSummary.title}".`,
            `/admin/summaries/${updatedSummary._id}`
        );
        // --------------------------------------------------------

        res.status(200).json(updatedSummary);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Supprimer un résumé
// @route   DELETE /api/summaries/:id
// @access  Private (Teacher/Admin)
const deleteSummary = async (req, res) => { // CORRECTION: Utilisation de 'const'
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de résumé invalide' });
    }
    
    try {
        const summaryToDelete = await Summary.findById(req.params.id);
        
        const result = await Summary.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Résumé non trouvé' });
        }
        
        // --- LOG ACTIVITÉ : Suppression par Admin/Teacher ---
        if (summaryToDelete) {
             logActivity(
                req.user._id,
                req.user.name,
                req.user.role,
                'content_summary_delete',
                `قام بحذف الملخص: "${summaryToDelete.title}".`,
                `/admin/summaries`
            );
        }
        // --------------------------------------------------------

        res.status(200).json({ message: 'Résumé supprimé مع succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSummaries,
    createSummary,
    updateSummary,
    deleteSummary,
    downloadSummary,
};