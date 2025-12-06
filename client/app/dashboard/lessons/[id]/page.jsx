// client/app/dashboard/lessons/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api';
// --- CORRECTION CLÉ: Ajout de FiUsers à l'importation ---
import { FiBookOpen, FiVideo, FiFileText, FiHelpCircle, FiLoader, FiCheckCircle, FiDownload, FiUsers } from 'react-icons/fi'; 

// Composant pour l'affichage des vidéos
const VideoPlayer = ({ url, title }) => (
    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-xl mb-4">
        {/* URL doit être une URL intégrable (embed) de YouTube ou Vimeo */}
        <iframe
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
        ></iframe>
    </div>
);

// Composant pour l'affichage des quiz
const QuizContent = ({ content }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const totalQuestions = content.data.questions.length;

    const handleAnswerSelect = (qIndex, oIndex) => {
        if (!isSubmitted) {
            setSelectedAnswers(prev => ({
                ...prev,
                [qIndex]: oIndex
            }));
        }
    };

    const handleSubmitQuiz = () => {
        let currentScore = 0;
        content.data.questions.forEach((q, qIndex) => {
            const selectedOptionIndex = selectedAnswers[qIndex];
            if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex].isCorrect) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setIsSubmitted(true);
        // Note: Ici, vous ajouteriez l'activité 'quiz_pass' à la BD
        console.log(`[ACTIVITY] Quiz submitted with score: ${currentScore}/${totalQuestions}`);
    };

    return (
        <Card className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-madaure-primary">{content.title}</h3>
            {content.data.questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <p className="font-semibold text-gray-900">{qIndex + 1}. {q.questionText}</p>
                    <div className="space-y-2">
                        {q.options.map((opt, oIndex) => {
                            const isSelected = selectedAnswers[qIndex] === oIndex;
                            const isCorrect = opt.isCorrect;
                            
                            let bgColor = 'bg-white hover:bg-gray-50';
                            if (isSubmitted) {
                                if (isCorrect) bgColor = 'bg-green-100 border-green-500';
                                else if (isSelected) bgColor = 'bg-red-100 border-red-500';
                            }

                            return (
                                <button
                                    key={oIndex}
                                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                    disabled={isSubmitted}
                                    className={`w-full text-right p-3 rounded-lg border transition-colors ${bgColor} ${isSelected && !isSubmitted ? 'border-madaure-primary ring-1 ring-madaure-primary' : ''}`}
                                >
                                    {isSubmitted && isCorrect && <FiCheckCircle className="inline text-green-600 ml-2" />}
                                    {opt.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
            
            {!isSubmitted ? (
                <Button onClick={handleSubmitQuiz} className="w-full">
                    إرسال الإختبار
                </Button> 
            ) : (
                <Alert 
                    type={score === totalQuestions ? 'success' : 'info'} 
                    message={`نتيجتك: ${score} من ${totalQuestions}.`} 
                />
            )}
        </Card>
    );
};

// Composant pour le contenu textuel/HTML
const TextContent = ({ content }) => (
    <Card className="p-6">
        <h3 className="text-xl font-bold text-madaure-primary mb-4">{content.title}</h3>
        {/* Dangerously set inner HTML pour rendre le contenu HTML riche du backend */}
        <div 
            className="prose prose-md max-w-none"
            dangerouslySetInnerHTML={{ __html: content.data.body }} 
        />
    </Card>
);

// Composant pour la référence de résumé (téléchargement)
const SummaryRefContent = ({ content, summaries }) => {
    const summary = summaries.find(s => s._id === content.data.summaryId);
    
    // Fonctionnalité de téléchargement simulée
    const handleDownload = () => {
        // Enregistre l'activité et ouvre le lien (simulé)
        console.log(`[ACTIVITY LOG] Downloading summary ID: ${summary._id}`);
        if (summary?.fileUrl) {
            window.open(summary.fileUrl, '_blank');
        }
    };

    if (!summary) {
        return <Alert type="warning" message="الملخص المرفق غير موجود أو غير متاح." />;
    }

    return (
        <Card className="p-6 flex justify-between items-center shadow-md border-r-4 border-blue-500">
            <div>
                <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                    الملخص: {summary.title} ({summary.subject})
                </p>
            </div>
            <Button onClick={handleDownload} variant="secondary" className="flex items-center gap-2">
                <FiDownload /> تحميل الملخص
            </Button>
        </Card>
    );
};


const SingleLessonPage = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [summaries, setSummaries] = useState([]); // Pour les références de résumé
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger la leçon et les résumés
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Charger la leçon
                const lessonResponse = await api.get(`/lessons/${id}`);
                setLesson(lessonResponse.data);
                
                // 2. Charger tous les résumés pour les références
                const summariesResponse = await api.get('/summaries');
                setSummaries(summariesResponse.data);
                
                setError(null);
            } catch (err) {
                const msg = err.response?.data?.message || "فشل في تحميل تفاصيل الدرس.";
                setError(msg);
                console.error("Single Lesson Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) return (
        <div dir="rtl" className="flex items-center justify-center h-48 text-madaure-primary">
            <FiLoader className="animate-spin text-3xl ml-3" /> جاري تحميل الدرس...
        </div>
    );

    if (error) return <Alert type="error" message={`خطأ: ${error}`} className="mt-8" />;

    if (!lesson) return <Alert type="info" message="هذا الدرس غير موجود أو تم حذفه." className="mt-8" />;

    return (
        <div dir="rtl" className="space-y-6 p-6">
            <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-2">{lesson.title}</h1>
            <p className="text-xl text-gray-600">{lesson.description}</p>
            
            <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-700">
                <span className="flex items-center gap-1"><FiBookOpen /> المادة: {lesson.subject}</span>
                <span className="flex items-center gap-1"><FiUsers /> الأستاذ: {lesson.teacher.name}</span>
            </div>

            <div className="space-y-8 pt-4">
                {lesson.content && lesson.content.map((contentBlock, index) => (
                    <div key={index}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {index + 1}. {contentBlock.title}
                        </h2>
                        
                        {contentBlock.type === 'video' && <VideoPlayer url={contentBlock.data.url} title={contentBlock.title} />}
                        {contentBlock.type === 'quiz' && <QuizContent content={contentBlock} />}
                        {contentBlock.type === 'text' && <TextContent content={contentBlock} />}
                        {contentBlock.type === 'summary-ref' && <SummaryRefContent content={contentBlock} summaries={summaries} />}
                        
                        {/* Barre de progression ou boutons "Marquer comme complété" peuvent être ajoutés ici */}
                    </div>
                ))}
            </div>
            
            <div className="border-t pt-6 mt-6">
                <Button variant="primary" className="w-full md:w-auto flex items-center justify-center gap-2">
                    <FiCheckCircle /> إكمال الدرس
                </Button>
            </div>
        </div>
    );
};

export default SingleLessonPage;