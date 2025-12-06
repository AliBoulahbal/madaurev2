// server/controllers/lessonController.js

const Lesson = require('../models/Lesson');
const mongoose = require('mongoose');

// @desc    Créer une nouvelle leçon
// @route   POST /api/lessons
// @access  Private (Teacher/Admin)
exports.createLesson = async (req, res) => {
    // Le middleware 'protect' a déjà mis l'objet utilisateur dans req.user
    const teacherId = req.user._id; 
    
    const { title, description, subject, isLive, startTime, duration, content } = req.body;
    
    // Validation de base
    if (!title || !description || !subject || !duration || content.length === 0) {
        return res.status(400).json({ message: "Veuillez fournir un titre, une description, un sujet, une durée et au moins un bloc de contenu." });
    }

    // Gérer les types de contenu vides pour éviter les erreurs Mongoose
    const cleanedContent = content.map(block => {
        if (block.type === 'quiz' && (!block.data.questions || block.data.questions.length === 0)) {
            // Optionnel: On pourrait filtrer les blocs vides ici, mais on se fie à la validation Front-end robuste.
        }
        return block;
    });


    try {
        const newLesson = await Lesson.create({
            title,
            description,
            subject,
            // ASSURANCE : Utiliser l'ID du professeur authentifié
            teacher: teacherId, 
            isLive: isLive || false,
            // Convertir la durée en nombre (même si le Front-end le fait, sécurité)
            duration: Number(duration), 
            // S'assurer que startTime est un objet Date valide ou undefined
            startTime: isLive && startTime ? new Date(startTime) : undefined,
            content: cleanedContent,
            status: 'scheduled',
        });

        // Si la création réussit, la redirection Front-end doit avoir lieu
        res.status(201).json(newLesson);

    } catch (error) {
        console.error("Lesson Creation Mongoose Error:", error);
        
        // Gérer les erreurs de validation spécifiques à Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Erreur de validation des données.", 
                errors: error.errors 
            });
        }
        
        res.status(500).json({ message: "Échec de l'enregistrement du cours. Vérifiez le format des données (date, nombre)." });
    }
};

// ... autres fonctions (getAllLessons, getLessonById, updateLesson, deleteLesson)
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ status: { $ne: 'cancelled' } })
                                    .populate('teacher', 'name email')
                                    .sort({ startTime: 1 });
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLessonById = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de leçon invalide' });
    }
    try {
        const lesson = await Lesson.findById(req.params.id).populate('teacher', 'name email');
        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLesson = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de leçon invalide' });
    }
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLesson = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de leçon invalide' });
    }
    try {
        const result = await Lesson.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        res.status(200).json({ message: 'Leçon supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};