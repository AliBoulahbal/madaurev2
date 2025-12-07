const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
// Importation de la fonction logActivity
const { logActivity } = require('./activityController'); 

// @desc    Créer un nouveau quiz (Admin/Teacher)
// @route   POST /api/quizzes
// @access  Private (Admin/Teacher)
const createQuiz = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const { title, subject, questions, lessonId, minScoreToPass } = req.body;
    
    if (!title || !subject || !questions || questions.length === 0) {
        return res.status(400).json({ message: "Veuillez fournir un titre, un sujet et au moins une question." });
    }

    try {
        const newQuiz = await Quiz.create({
            title,
            subject,
            questions,
            lesson: lessonId,
            minScoreToPass,
            createdBy: req.user._id,
        });

        // --- LOG ACTIVITÉ : Création de Quiz ---
        logActivity(
            req.user._id,
            req.user.name,
            req.user.role,
            'content_quiz_create',
            `أنشأ اختباراً جديداً: "${newQuiz.title}" (${newQuiz.subject}).`,
            `/admin/quizzes/${newQuiz._id}`
        );
        // -------------------------------------

        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir un quiz par ID (pour l'affichage)
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => { // CORRECTION: Utilisation de 'const'
    try {
        const quiz = await Quiz.findById(req.params.id)
                               .select('-questions.options.isCorrect'); // Ne pas envoyer les réponses correctes au client

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz non trouvé.' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Soumettre les réponses au quiz (ACTION ÉTUDIANT)
// @route   POST /api/quizzes/:id/submit
// @access  Private
const submitQuiz = async (req, res) => { // CORRECTION: Utilisation de 'const'
    const quizId = req.params.id;
    const { answers } = req.body; // { questionId: 'optionId', ... }
    
    const userId = req.user._id;
    const userName = req.user.name;
    const userRole = req.user.role;

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz non trouvé.' });
        }

        let correctCount = 0;
        const totalQuestions = quiz.questions.length;
        
        // Logique de correction
        quiz.questions.forEach(question => {
            const submittedOptionId = answers[question._id.toString()];
            
            // Trouver l'option correcte dans la base de données
            const correctAnswer = question.options.find(opt => opt.isCorrect === true);
            
            if (correctAnswer && correctAnswer._id.toString() === submittedOptionId) {
                correctCount++;
            }
        });

        const scorePercentage = (correctCount / totalQuestions) * 100;
        const isPassed = scorePercentage >= quiz.minScoreToPass;
        
        // **********************************************
        // LOGIQUE D'ENREGISTREMENT DE L'ACTIVITÉ
        // **********************************************
        const actionType = isPassed ? 'quiz_passed' : 'quiz_failed';
        const description = isPassed 
            ? `اجتزت اختبار "${quiz.title}" بنجاح (${scorePercentage.toFixed(0)}%).`
            : `فشلت في اختبار "${quiz.title}" (${scorePercentage.toFixed(0)}%).`;
        
        logActivity(
            userId,
            userName,
            userRole,
            actionType, 
            description, 
            `/dashboard/lessons/quiz/${quizId}`
        );
        // **********************************************

        // NOTE: Ici, vous enregistreriez le résultat de l'utilisateur dans un modèle de "QuizResult"

        res.status(200).json({
            message: isPassed ? 'تهانينا! لقد اجتزت الاختبار.' : 'حظا سعيدا في المرة القادمة.',
            score: scorePercentage.toFixed(1),
            passed: isPassed,
            correctAnswers: correct