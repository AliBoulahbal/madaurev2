// server/controllers/faqController.js

// NOTE: En production, vous auriez un modèle 'FAQ' pour stocker les Q/R.

// Données FAQ Simples
const simulatedFaqData = [
    { id: 1, question: 'كيف يمكنني تفعيل رمز الإشتراك؟', answer: 'اذهب إلى صفحة "الإشتراك" وأدخل الرمز المكون من 8 أرقام.' },
    { id: 2, question: 'ما هي مدة صلاحية الدروس المباشرة؟', answer: 'تصبح متاحة للمشاهدة لمدة 30 يوماً بعد البث.' },
    { id: 3, question: 'هل يمكنني تحميل ملفات PDF والملخصات؟', answer: 'نعم، إذا كان لديك إشتراك فعال.' },
];


// @desc    Obtenir toutes les questions fréquentes
// @route   GET /api/support/faq
// @access  Private
exports.getAllFaq = async (req, res) => {
    // Simule la récupération des données
    res.status(200).json(simulatedFaqData);
};

// @desc    Créer une nouvelle question fréquente
// @route   POST /api/support/faq
// @access  Private (Admin)
exports.createFaq = async (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ message: "Les champs question et réponse sont requis." });
    }

    // Simule la création (en production, cela insérerait dans la BD)
    const newFaqItem = {
        id: Date.now(),
        question,
        answer,
        creator: req.user._id,
    };
    
    // Pour les tests, on loge la nouvelle FAQ
    console.log("[FAQ] Nouvelle question créée:", newFaqItem); 

    res.status(201).json(newFaqItem);
};