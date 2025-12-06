'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { FiPlayCircle, FiBookOpen } from 'react-icons/fi';

// Fonction utilitaire pour extraire l'ID YouTube (à partir d'une URL simple, courte ou embarquée)
const getYouTubeID = (url) => {
    if (!url) return null;
    
    // Expression régulière pour capturer l'ID dans les formats courants de YouTube
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    // L'ID YouTube est toujours de 11 caractères
    return match && match[1].length === 11 ? match[1] : null;
};

// Fonction utilitaire pour extraire l'ID Vimeo
const getVimeoID = (url) => {
    if (!url) return null;
    
    // Expression régulière pour capturer l'ID Vimeo (généralement uniquement des chiffres)
    const regex = /(?:vimeo\.com\/(?:video\/|channels\/\w+\/|groups\/\w+\/videos\/|album\/\d+\/video\/|))\/?(\d+)/;
    const match = url.match(regex);
    
    // Retourne l'ID numérique s'il est trouvé
    return match ? match[1] : null;
};


// Composant de carte de leçon (pour affichage en grille)
const LessonCard = ({ lesson }) => {
    let videoId = null;
    let thumbnailUrl = 'https://placehold.co/600x400/CCCCCC/333333?text=Lesson+Video'; // Placeholder par défaut
    let videoType = null;
    
    const lessonUrl = lesson.videoUrl || '';

    // Détermination du type de vidéo et extraction de l'ID
    if (lessonUrl.includes('youtube.com') || lessonUrl.includes('youtu.be')) {
        videoId = getYouTubeID(lessonUrl);
        videoType = 'youtube';
    } else if (lessonUrl.includes('vimeo.com')) {
        videoId = getVimeoID(lessonUrl);
        videoType = 'vimeo';
    }

    if (videoId) {
        if (videoType === 'youtube') {
            // Utilise la vignette de la meilleure qualité disponible pour YouTube
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        } else if (videoType === 'vimeo') {
            // Utiliser une URL de vignette Vimeo temporaire pour la démo, en attendant que le backend fournisse le hash
            thumbnailUrl = 'https://placehold.co/600x400/C8A2C8/FFFFFF?text=VIMEO+VIDEO'; 
        }
    }
    
    // Lien de destination vers la page de la leçon (ID est nécessaire pour Next.js)
    const lessonLink = `/dashboard/lessons/${lesson.id}`; 
    
    // Fallback pour les cas où la vignette YouTube de haute résolution (maxresdefault) n'est pas disponible
    const handleImageError = (e) => {
        // Cette fonction sera appelée si l'image dans 'src' ne charge pas
        e.target.onerror = null; 

        if (videoType === 'youtube' && videoId) {
             // Tenter la vignette de qualité standard (mqdefault) en cas d'échec de maxresdefault
             e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        } else {
             // Placeholder final pour tous les autres cas (Vimeo, URL invalide, etc.)
             e.target.src = 'https://placehold.co/600x400/CCCCCC/333333?text=Lesson+Video';
        }
    };


    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg border border-gray-100">
            {/* Conteneur de la Vignette */}
            <Link href={lessonLink} className="relative block h-40 bg-gray-200 group">
                {/* L'image est responsive dans le conteneur h-40 */}
                <Image
                    src={thumbnailUrl}
                    alt={`Vignette pour ${lesson.title}`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError} // Gestion d'erreur critique pour les vignettes YouTube
                />
                
                {/* Icône Play (Affiché uniquement si un ID vidéo est trouvé) */}
                {videoId && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <FiPlayCircle className="text-white text-5xl opacity-80 transition-opacity group-hover:opacity-100" />
                    </div>
                )}
            </Link>

            {/* Corps de la Carte (Détails) */}
            <div className="p-4 flex flex-col flex-1" dir="rtl">
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={lesson.title}>
                    {lesson.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 flex-1">
                    الوحدة: {lesson.unit || 'عام'} | المادة: {lesson.subject || 'غير محدد'}
                </p>

                {/* Bouton d'Action */}
                <div className="mt-auto">
                    <Link href={lessonLink}>
                        <button className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-madaure-primary text-white hover:bg-red-700 transition-colors">
                            مشاهدة الدرس
                        </button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default LessonCard;