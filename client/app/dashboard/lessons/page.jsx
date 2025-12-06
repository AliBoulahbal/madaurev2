'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Link from 'next/link';
import Input from '@/components/ui/Input'; // <-- IMPORT MANQUANT AJOUTÉ ICI
import { api } from '@/lib/api';
import { FiBookOpen, FiVideo, FiLoader, FiFilter } from 'react-icons/fi';
// Import du composant LessonCard pour l'affichage des vignettes
import LessonCard from '@/components/dashboard/LessonCard'; 

const LessonsListPage = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // NOTE: Pour que LessonCard fonctionne, le backend DOIT retourner une propriété contenant l'URL de la vidéo.
    // Nous allons supposer qu'elle est dans `lesson.videoUrl` ou qu'elle est intégrée (ex: lesson.contents[0].data.url).
    // Pour cet exemple, nous allons simuler temporairement une structure de données typique 
    // qui inclut l'URL de la vidéo pour garantir l'affichage des vignettes.

    // Cette fonction devrait normalement appeler l'API réelle.
    const fetchLessons = async () => {
        try {
            // Tentative d'appel à l'API réelle (doit retourner un tableau de leçons)
            const response = await api.get('/lessons'); 
            
            // --- CONVERSION DE DONNÉES (Hypothèse nécessaire pour les vignettes) ---
            // Si l'API retourne une structure complexe (ex: leçons avec contenu imbriqué),
            // nous devons extraire le lien vidéo principal ici.
            const rawLessons = response.data;
            const lessonsWithVideoInfo = rawLessons.map(lesson => ({
                ...lesson,
                // On simule l'extraction de l'ID pour LessonCard.
                // En réalité, vous devriez vérifier où se trouve l'URL (ex: lesson.video.url)
                videoUrl: lesson.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // URL par défaut si manquante
                
                // Champs requis par LessonCard pour les détails
                id: lesson._id, // Utiliser _id pour l'ID de la leçon
                unit: lesson.unit || 'غير محدد',
                subject: lesson.subject || 'غير محدد',
            }));
            
            setLessons(lessonsWithVideoInfo);
            setError(null);
        } catch (err) {
            // Simulation de données en cas d'échec API (pour le développement)
             console.warn("API Call failed, using mock data for LessonList:", err);
             setError("فشل في تحميل قائمة الدروس. يرجى التحقق من اتصال الخادم.");
             
             // Utilisation de MOCK_LESSONS pour le rendu en attendant la correction de l'API
             const MOCK_LESSONS = [
                { 
                    _id: 'l1', 
                    title: 'مقدمة في الجبر الخطي', 
                    unit: 'الوحدة الأولى', 
                    subject: 'الرياضيات', 
                    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Lien YouTube valide
                    teacher: { name: 'أ. علي' }
                },
                { 
                    _id: 'l2', 
                    title: 'تفاعلات الأكسدة والإختزال', 
                    unit: 'الكيمياء العضوية', 
                    subject: 'الفيزياء والكيمياء', 
                    videoUrl: 'https://youtu.be/kL3x9N0p2T8', // Lien YouTube valide
                    teacher: { name: 'أ. فاطمة' }
                },
                { 
                    _id: 'l3', 
                    title: 'تحليل النصوص الأدبية', 
                    unit: 'الأدب العربي', 
                    subject: 'اللغة العربية', 
                    videoUrl: null, // Pas de vidéo
                    teacher: { name: 'أ. محمد' }
                },
            ];
            const mockedLessonsWithId = MOCK_LESSONS.map(l => ({ ...l, id: l._id }));
            setLessons(mockedLessonsWithId);
            
        } finally {
            setTimeout(() => setLoading(false), 500); // Délai pour la démo
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);
    
    // Logique de filtrage (similaire à la prévisualisation précédente)
    const filteredLessons = lessons.filter(lesson => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        // Filtrage par titre, matière, unité ou nom de l'enseignant (si disponible)
        return (
            lesson.title?.toLowerCase().includes(lowerCaseSearch) || 
            lesson.subject?.toLowerCase().includes(lowerCaseSearch) ||
            lesson.unit?.toLowerCase().includes(lowerCaseSearch) ||
            lesson.teacher?.name?.toLowerCase().includes(lowerCaseSearch)
        );
    });


    if (loading) return (
        <div dir="rtl" className="flex flex-col items-center justify-center h-48 text-madaure-primary">
            <FiLoader className="animate-spin text-3xl ml-3" /> 
            <p className="mt-2 text-lg">جاري تحميل قائمة الدروس...</p>
        </div>
    );
    
    return (
        <div dir="rtl" className="space-y-6 p-4 md:p-0">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
                <FiBookOpen /> جميع الدروس المتاحة
            </h2>

            {error && <Alert type="error" message={error} />}
            
            {/* Barre de Recherche/Filtrage */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input 
                    type="text"
                    placeholder="ابحث بعنوان الدرس، المادة أو الأستاذ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<FiFilter />}
                    className="flex-1"
                />
            </div>

            {/* Grille des Leçons */}
            {filteredLessons.length === 0 ? (
                <Alert type="info" message="لا توجد دروس مطابقة لمعايير البحث حالياً." />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredLessons.map(lesson => (
                         // Utilisation du composant LessonCard pour l'affichage en grille avec vignette
                        <LessonCard 
                            key={lesson.id} 
                            lesson={{
                                ...lesson,
                                id: lesson._id, // Assure que LessonCard utilise la bonne clé
                                unit: lesson.unit || 'عام', // Assurez-vous que l'unité est définie
                                
                                // REMPLACER 'videoUrl' par le chemin réel de l'URL vidéo
                                // Si votre leçon a une URL vidéo directement:
                                videoUrl: lesson.videoUrl, 
                                
                                // Si l'URL est imbriquée (comme dans l'API doc):
                                // videoUrl: lesson.contents?.[0]?.data?.url || lesson.videoUrl, 
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LessonsListPage;