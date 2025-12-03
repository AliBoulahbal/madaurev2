// server/src/controllers/lessonController.js

const Lesson = require('../models/Lesson');

// @desc    Get all lessons (for students - filter by scheduled/live)
// @route   GET /api/lessons
// @access  Private (Students/Teachers)
exports.getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({ 
            status: { $in: ['scheduled', 'live'] } 
        })
        .populate('teacher', 'name email role') // Affiche les infos de l'enseignant
        .sort({ startTime: 1 }); // Trie par date de début
        
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new lesson (Teacher/Admin only)
// @route   POST /api/lessons
// @access  Private (Teacher/Admin)
exports.createLesson = async (req, res) => {
    // Vérifier si l'utilisateur est un 'teacher' ou 'admin' (middleware s'en charge, mais c'est une bonne pratique)
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to create a lesson' });
    }
    
    const { title, description, subject, startTime, duration, isLive } = req.body;
    
    try {
        const lesson = await Lesson.create({
            title,
            description,
            subject,
            startTime,
            duration,
            isLive,
            teacher: req.user._id, // Assigner l'utilisateur connecté comme enseignant
            status: 'scheduled'
        });
        
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// TODO: Ajouter updateLesson, deleteLesson (Admin/Teacher) et getLessonById