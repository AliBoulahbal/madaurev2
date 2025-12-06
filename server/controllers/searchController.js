// server/controllers/searchController.js
const Lesson = require('../models/Lesson');
const Summary = require('../models/Summary');
const User = require('../models/User'); 

// @desc    Effectuer une recherche globale rapide (Leçons, Résumés, Professeurs)
// @route   GET /api/search?q=:query
// @access  Private
exports.globalSearch = async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        // Retourne un résultat vide si la requête est vide
        return res.status(200).json({ results: [] });
    }

    // Utilisation d'une expression régulière insensible à la casse pour la recherche partielle
    const regex = new RegExp(q, 'i'); 

    try {
        // --- 1. Recherche dans les Leçons ---
        const lessonResults = await Lesson.find({
            $or: [{ title: regex }, { description: regex }],
            status: { $ne: 'cancelled' }
        })
        // S'assurer que les champs _id, subject sont sélectionnés
        .select('title subject teacher isLive _id') 
        .populate('teacher', 'name')
        .limit(5);

        // --- 2. Recherche dans les Résumés ---
        const summaryResults = await Summary.find({
            $or: [{ title: regex }, { subject: regex }]
        })
        .select('title subject _id')
        .populate('teacher', 'name')
        .limit(5);

        // --- 3. Recherche des Professeurs ---
        const teacherResults = await User.find({
            $or: [{ name: regex }],
            role: 'teacher' // Filtrer uniquement les utilisateurs ayant le rôle 'teacher'
        })
        .select('name branch email _id')
        .limit(5);

        // --- 4. Consolidation et Formatage des résultats pour le Frontend ---
        const results = [
            ...lessonResults.map(item => ({ 
                type: 'lesson', 
                title: item.title, 
                subject: item.subject, 
                id: item._id, 
                link: `/dashboard/lessons/${item._id}` 
            })),
            ...summaryResults.map(item => ({ 
                type: 'summary', 
                title: item.title, 
                subject: item.subject, 
                id: item._id, 
                // Note: La route vers les résumés n'est pas encore définie, on utilise un ID comme placeholder
                link: `/dashboard/summaries/${item._id}` 
            })),
            ...teacherResults.map(item => ({ 
                type: 'teacher', 
                title: item.name, 
                subject: item.branch, 
                id: item._id, 
                link: `/dashboard/teachers/${item._id}` 
            })),
        ];

        res.status(200).json({ results });

    } catch (error) {
        // En cas d'erreur Mongoose ou autre
        console.error("Global Search Fatal Error:", error);
        res.status(500).json({ message: "Erreur serveur lors de la recherche globale. Veuillez vérifier les modèles/index." });
    }
};