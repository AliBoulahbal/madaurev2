// client/app/admin/lessons/create/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { FiBookOpen, FiVideo, FiFileText, FiPlus, FiTrash2, FiSave, FiLoader } from 'react-icons/fi';

// Composant pour ajouter un quiz simple
const QuizContentForm = ({ content, updateContent }) => {
    // Initialiser avec un ensemble de questions minimum
    const initialQuestions = content.data.questions || [
        { questionText: 'Question 1', options: [{ text: 'Answer A', isCorrect: true }, { text: 'Answer B', isCorrect: false }] }
    ];
    
    const [questions, setQuestions] = useState(initialQuestions);

    const handleUpdate = useCallback((newQuestions) => {
        setQuestions(newQuestions);
        // Mettre à jour le contenu global uniquement après une modification validée
        updateContent({ ...content, data: { questions: newQuestions } });
    }, [content, updateContent]);


    const handleQuestionChange = (qIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionText = text;
        handleUpdate(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = text;
        handleUpdate(newQuestions);
    };
    
    const handleCorrectToggle = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // Assurez-vous qu'une seule réponse est correcte
        newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, idx) => ({
            ...opt,
            isCorrect: idx === oIndex
        }));
        handleUpdate(newQuestions);
    };

    return (
        <div className="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <h4 className="font-semibold text-lg text-madaure-primary">إضافة أسئلة الإختبار</h4>
            {questions.map((q, qIndex) => (
                <Card key={qIndex} className="p-4 space-y-3">
                    <Input 
                        type="text"
                        placeholder={`السؤال ${qIndex + 1}`}
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        // Laissez la validation à isFormValid() pour un meilleur contrôle
                    />
                    <div className="space-y-2">
                        {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={`q-${qIndex}`}
                                    checked={opt.isCorrect}
                                    onChange={() => handleCorrectToggle(qIndex, oIndex)}
                                    className="text-madaure-primary"
                                />
                                <Input
                                    type="text"
                                    placeholder={`خيار ${oIndex + 1}`}
                                    value={opt.text}
                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                    // Laissez la validation à isFormValid() pour un meilleur contrôle
                                    className={`flex-1 ${opt.isCorrect ? 'border-green-500' : 'border-gray-300'}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleUpdate(questions.filter((_, i) => i !== qIndex))}
                        >
                            <FiTrash2 /> حذف السؤال
                        </Button>
                    </div>
                </Card>
            ))}
            <Button 
                type="button" // Important pour ne pas soumettre le formulaire
                variant="outline" 
                onClick={() => handleUpdate([...questions, { 
                    questionText: '', 
                    options: [{ text: 'Réponse A', isCorrect: true }, { text: 'Réponse B', isCorrect: false }] 
                }])}
            >
                <FiPlus /> إضافة سؤال
            </Button>
        </div>
    );
};

// Composant pour ajouter un bloc de contenu (vidéo, texte, ou quiz)
const ContentBlockForm = ({ block, index, updateBlock, removeBlock, summaries }) => {
    const isVideo = block.type === 'video';
    const isText = block.type === 'text';
    const isQuiz = block.type === 'quiz';
    const isSummaryRef = block.type === 'summary-ref';
    
    // Assurez-vous que l'index de l'ordre est toujours l'index + 1
    useEffect(() => {
        updateBlock({ ...block, order: index + 1 });
    }, [index]);

    const handleDataChange = (key, value) => {
        updateBlock({
            ...block,
            data: {
                ...block.data,
                [key]: value
            }
        });
    };
    
    const handleQuizContentUpdate = (newContent) => {
         updateBlock(newContent);
    };

    return (
        <Card className="p-4 border-l-4 border-madaure-primary shadow-md">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">
                    {index + 1}. {isVideo && 'فيديو'}
                    {isText && 'نص'}
                    {isQuiz && 'إختبار'}
                    {isSummaryRef && 'ملخص مرفق'}
                </h3>
                <Button variant="danger" size="sm" onClick={() => removeBlock(index)}>
                    <FiTrash2 /> حذف
                </Button>
            </div>

            <Input
                type="text"
                placeholder="عنوان هذا الجزء (مثال: المقدمة)"
                value={block.title}
                onChange={(e) => updateBlock({ ...block, title: e.target.value })}
                className="mb-3"
            />

            {/* Formulaires spécifiques au type de contenu */}
            {isVideo && (
                <Input
                    type="url"
                    placeholder="رابط الفيديو (Embed YouTube ou Vimeo)"
                    value={block.data.url || ''}
                    onChange={(e) => handleDataChange('url', e.target.value)}
                    // Laissez la validation à isFormValid()
                />
            )}

            {isText && (
                <textarea
                    placeholder="محتوى النص المفصل..."
                    value={block.data.body || ''}
                    onChange={(e) => handleDataChange('body', e.target.value)}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-madaure-primary focus:border-madaure-primary transition-colors resize-y"
                    // Laissez la validation à isFormValid()
                />
            )}
            
            {isSummaryRef && (
                <select 
                    value={block.data.summaryId || ''}
                    onChange={(e) => handleDataChange('summaryId', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-madaure-primary focus:border-madaure-primary transition-colors"
                >
                    <option value="" disabled>اختر ملخص PDF مرفق...</option>
                    {summaries.map(s => (
                        <option key={s._id} value={s._id}>{s.title} ({s.subject})</option>
                    ))}
                </select>
            )}

            {isQuiz && (
                <QuizContentForm 
                    content={block} 
                    updateContent={handleQuizContentUpdate}
                />
            )}
        </Card>
    );
};

// Composant Principal de Création de Leçon
const CreateLessonPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    
    // État du formulaire de la leçon
    const [lessonData, setLessonData] = useState({
        title: '',
        description: '',
        subject: '',
        isLive: false,
        startTime: '', // Date et Heure
        duration: 60,
        content: [] // Tableau des blocs de contenu
    });
    
    // État des données additionnelles
    const [summaries, setSummaries] = useState([]); // Liste des résumés pour les références
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Vérification d'autorisation (Teacher ou Admin)
    useEffect(() => {
        if (!authLoading && user && user.role !== 'admin' && user.role !== 'teacher') {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);
    
    // Charger les résumés disponibles
    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                // Endpoint simulé pour obtenir tous les résumés (utile pour les références)
                const response = await api.get('/summaries'); 
                setSummaries(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des résumés:", err);
                // Laisse la page se charger même si les résumés manquent
            }
        };
        fetchSummaries();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLessonData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? (value === '' ? '' : Number(value)) : value) // Gère les nombres et les chaînes vides
        }));
        setError(null);
    };
    
    const addContentBlock = (type) => {
        const newBlock = {
            type,
            title: '',
            order: lessonData.content.length + 1,
            data: {}
        };
        if (type === 'summary-ref') {
            newBlock.data.summaryId = summaries[0]?._id || '';
        }
        setLessonData(prev => ({
            ...prev,
            content: [...prev.content, newBlock]
        }));
    };
    
    const updateContentBlock = (index, newBlock) => {
        const newContent = lessonData.content.map((block, i) => i === index ? newBlock : block);
        setLessonData(prev => ({ ...prev, content: newContent }));
    };

    const removeContentBlock = (index) => {
        const newContent = lessonData.content.filter((_, i) => i !== index)
                                        .map((block, i) => ({ ...block, order: i + 1 })); // Réordonner
        setLessonData(prev => ({ ...prev, content: newContent }));
    };
    
    // Vérification de la validité détaillée
    const isContentBlocksValid = () => {
        for (const block of lessonData.content) {
            if (!block.title || block.title.trim() === '') return { isValid: false, message: `Veuillez renseigner le titre du bloc de contenu n°${block.order}.` };
            
            if (block.type === 'video' && (!block.data.url || block.data.url.trim() === '')) 
                return { isValid: false, message: `Le bloc Vidéo n°${block.order} nécessite une URL.` };

            if (block.type === 'text' && (!block.data.body || block.data.body.trim() === '')) 
                return { isValid: false, message: `Le bloc Texte n°${block.order} nécessite un contenu.` };
            
            // Validation simple du Quiz: au moins une question
            if (block.type === 'quiz' && (!block.data.questions || block.data.questions.length === 0))
                return { isValid: false, message: `Le bloc Quiz n°${block.order} nécessite au moins une question.` };
        }
        return { isValid: true };
    };


    const isFormValid = () => {
        const requiredFields = ['title', 'description', 'subject'];
        const isMetadataComplete = requiredFields.every(field => lessonData[field] && lessonData[field].trim() !== '');
        
        const isDurationValid = typeof lessonData.duration === 'number' && lessonData.duration > 0;
        const isTimeValid = !lessonData.isLive || (lessonData.isLive && lessonData.startTime && lessonData.startTime.trim() !== '');
        const hasContent = lessonData.content.length > 0;

        return isMetadataComplete && isDurationValid && isTimeValid && hasContent;
    };


    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation détaillée Front-end
        if (!isFormValid()) {
             setError("الرجاء ملء جميع الحقول المطلوبة وإضافة محتوى واحد على الأقل.");
             return;
        }

        const contentValidation = isContentBlocksValid();
        if (!contentValidation.isValid) {
            setError(`خطأ في المحتوى: ${contentValidation.message}`);
            return;
        }


        setLoading(true);
        setError(null);
        setSuccess(null);
        
        const dataToSend = { ...lessonData };

        // 1. Assurer la conversion des champs numériques
        dataToSend.duration = parseInt(dataToSend.duration, 10);
        
        // 2. Nettoyer les champs de temps si ce n'est pas un live
        if (!dataToSend.isLive) {
            delete dataToSend.startTime;
        }

        // --- DÉBOGAGE : Afficher les données envoyées ---
        console.log("--- STARTING LESSON SUBMISSION ---");
        console.log("Data to Send:", dataToSend);
        
        try {
            const response = await api.post('/lessons', dataToSend); 
            
            setSuccess(`تم إنشاء الدرس "${response.data.title}" بنجاح!`);
            console.log("SUCCESS: Lesson created.", response.data);
            
            // --- CORRECTION CLÉ : REDIRECTION ET ACTUALISATION ---
            // Redirige vers la page de la liste des leçons pour forcer la mise à jour chez l'étudiant
            setTimeout(() => {
                router.push('/dashboard/lessons');
            }, 1000); 

            
        } catch (err) {
            // DÉBOGAGE : Afficher l'erreur brute et l'état HTTP
            console.error("API CALL FAILED.", err.response?.status, err.response?.data);
            
            let errorMessage = "فشل في إنشاء الدرس. يرجى التحقق من المدخلات.";
            
            if (err.response && err.response.data) {
                const data = err.response.data;
                errorMessage = data.message || errorMessage;

                if (data.errors) {
                    const validationMessages = Object.values(data.errors)
                        .map(e => `[${e.path}]: ${e.message}`)
                        .join(' | ');
                    errorMessage += ` (Validation: ${validationMessages})`;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false); 
        }
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FiLoader className="animate-spin text-4xl text-madaure-primary" />
            </div>
        );
    }
    
    const isAdmin = user?.role === 'admin' || user?.role === 'teacher';

    if (!isAdmin) return null; // Devrait être redirigé par useEffect

    return (
        <div dir="rtl" className="space-y-6 p-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-2 mb-4">إنشاء درس جديد</h1>
            
            {success && <Alert type="success" message={success} />}
            {error && <Alert type="error" message={error} />}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                
                {/* Métadonnées de la Leçon */}
                <Card className="p-6 space-y-4 shadow-lg">
                    <h2 className="text-xl font-bold text-madaure-primary">معلومات الدرس الأساسية</h2>
                    <Input
                        type="text"
                        name="title"
                        placeholder="عنوان الدرس (مثال: المتتاليات العددية)"
                        value={lessonData.title}
                        onChange={handleChange}
                        required // La validation de required est maintenant gérée par isFormValid()
                    />
                    <textarea
                        name="description"
                        placeholder="وصف موجز للدرس..."
                        value={lessonData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-madaure-primary focus:border-madaure-primary transition-colors resize-y"
                        required // La validation de required est maintenant gérée par isFormValid()
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="text"
                            name="subject"
                            placeholder="المادة (مثال: الرياضيات)"
                            value={lessonData.subject}
                            onChange={handleChange}
                            required // La validation de required est maintenant gérée par isFormValid()
                        />
                        <Input
                            type="number"
                            name="duration"
                            placeholder="المدة بالدقائق (مثال: 90)"
                            value={lessonData.duration}
                            onChange={handleChange}
                            required // La validation de required est maintenant gérée par isFormValid()
                        />
                    </div>
                </Card>
                
                {/* Contenu et Ajout de Blocs */}
                <Card className="p-6 space-y-4 shadow-lg">
                    <h2 className="text-xl font-bold text-madaure-primary mb-4">هيكلة المحتوى ({lessonData.content.length} جزء)</h2>
                    
                    {/* Liste des Blocs de Contenu */}
                    <div className="space-y-4">
                        {lessonData.content.map((block, index) => (
                            <ContentBlockForm
                                key={index} // Utilisation de l'index pour la clé
                                block={block}
                                index={index}
                                summaries={summaries}
                                updateBlock={(newBlock) => updateContentBlock(index, newBlock)}
                                removeBlock={removeContentBlock}
                            />
                        ))}
                    </div>

                    {/* Zone d'Ajout de Blocs */}
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-semibold mb-3">أضف محتوى:</h3>
                        <div className="flex gap-3 flex-wrap">
                            <Button type="button" variant="secondary" onClick={() => addContentBlock('video')}>
                                <FiVideo /> فيديو
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => addContentBlock('text')}>
                                <FiFileText /> نص/شرح
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => addContentBlock('quiz')}>
                                <FiPlus /> إختبار قصير
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => addContentBlock('summary-ref')}>
                                <FiBookOpen /> ملخص مرفق
                            </Button>
                        </div>
                    </div>
                </Card>
                
                {/* Options Live/Date et Bouton de Soumission */}
                <Card className="p-6 shadow-lg">
                     <div className="flex items-center space-x-4 space-x-reverse mb-4">
                        <input
                            type="checkbox"
                            name="isLive"
                            checked={lessonData.isLive}
                            onChange={handleChange}
                            className="w-5 h-5 text-madaure-primary border-gray-300 rounded focus:ring-madaure-primary"
                        />
                        <label className="text-lg font-medium text-gray-700">
                            هذا الدرس هو درس مباشر (يتطلب وقت بداية)
                        </label>
                    </div>
                    {lessonData.isLive && (
                         <Input
                            type="datetime-local"
                            name="startTime"
                            label="تاريخ ووقت البداية"
                            value={lessonData.startTime}
                            onChange={handleChange}
                            required
                        />
                    )}
                    
                    <Button 
                        type="submit" 
                        className="w-full mt-6 flex items-center justify-center gap-2" 
                        disabled={loading || !isFormValid()} 
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />} 
                        {loading ? 'جاري الحفظ...' : 'حفظ ونشر الدرس'}
                    </Button>
                </Card>
            </form>
        </div>
    );
};

export default CreateLessonPage;