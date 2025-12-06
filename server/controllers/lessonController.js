const mongoose = require('mongoose');
const Lesson = require('../models/Lesson'); // Assumer que vous avez un modèle Lesson
// Importation de la fonction logActivity depuis le nouveau contrôleur d'activité
const { logActivity } = require('./activityController'); 

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
        
        // --- LOG ACTIVITÉ : Création de Leçon par Admin/Teacher ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'content_lesson_create',
            `أنشأ الدرس الجديد: "${newLesson.title}" (${newLesson.subject}).`,
            `/admin/lessons/${newLesson._id}`
        );
        // -----------------------------------------------------

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


// @desc    Obtenir toutes les leçons (pour la page dashboard/lessons)
// @route   GET /api/lessons
// @access  Private
exports.getAllLessons = async (req, res) => {
    try {
        // Dans une application réelle, on filtrerait par la branche de l'utilisateur (req.user.branch)
        const lessons = await Lesson.find({ status: { $ne: 'cancelled' } })
                                    .populate('teacher', 'name email')
                                    .sort({ startTime: 1 });
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir une seule leçon par ID
// @route   GET /api/lessons/:id
// @access  Private
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

// @desc    Marquer une leçon comme complétée par l'utilisateur (ACTION ÉTUDIANT)
// @route   POST /api/lessons/:id/complete
// @access  Private
exports.markLessonAsComplete = async (req, res) => {
    const lessonId = req.params.id;
    const userId = req.user._id;
    const userName = req.user.name;
    const userRole = req.user.role;

    try {
        const lesson = await Lesson.findById(lessonId);

        if (!lesson) {
            return res.status(404).json({ message: 'Leçon non trouvée.' });
        }
        
        // **********************************************
        // LOGIQUE D'ENREGISTREMENT DE L'ACTIVITÉ
        // **********************************************
        logActivity(
            userId,
            userName,
            userRole,
            'lesson_completed', 
            `أكملت درس "${lesson.title}" في المادة ${lesson.subject || 'غير محدد'}.`, 
            `/dashboard/lessons/${lessonId}`
        );
        
        // NOTE: Ici, vous ajouteriez la logique réelle pour enregistrer l'état de complétion.
        
        res.status(200).json({ message: 'Leçon marquée comme complétée et activité مسجلة.' });

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état de la leçon.' });
    }
};

// @desc    Mettre à jour une leçon
// @route   PUT /api/lessons/:id
// @access  Private (Teacher/Admin)
exports.updateLesson = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de leçon invalide' });
    }
    try {
        const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        
        // --- LOG ACTIVITÉ : Mise à jour par Admin/Teacher ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'content_lesson_update',
            `قام بتحديث الدرس: "${updatedLesson.title}".`,
            `/admin/lessons/${updatedLesson._id}`
        );
        // -----------------------------------------------------
        
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Supprimer une leçon
// @route   DELETE /api/lessons/:id
// @access  Private (Teacher/Admin)
exports.deleteLesson = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'ID de leçon invalide' });
    }
    try {
        const lessonToDelete = await Lesson.findById(req.params.id);

        const result = await Lesson.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Leçon non trouvée' });
        }
        
        // --- LOG ACTIVITÉ : Suppression par Admin/Teacher ---
        if (lessonToDelete) {
             logActivity(
                req.user._id,
                req.user.name,
                req.user.role,
                'content_lesson_delete',
                `قام بحذف الدرس: "${lessonToDelete.title}".`,
                `/admin/lessons`
            );
        }
        // -----------------------------------------------------
        
        res.status(200).json({ message: 'Leçon supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllLessons,
    getLessonById,
    markLessonAsComplete,
    createLesson,
    updateLesson,
    deleteLesson,
};