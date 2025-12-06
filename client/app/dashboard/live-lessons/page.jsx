// client/app/dashboard/live-lessons/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FiMonitor, FiCalendar, FiClock, FiUsers, FiLoader, FiPlay } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const LiveLessonCard = ({ lesson }) => {
    const teacherName = lesson.teacher?.name || 'غير محدد';
    const isToday = new Date(lesson.startTime).toDateString() === new Date().toDateString();

    const getStartTime = (startTime) => {
        if (!startTime) return '---';
        // Utilise la locale 'ar' sans région spécifique pour les noms arabes et les chiffres occidentaux
        return new Date(startTime).toLocaleDateString('ar', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };
    
    const isTimeNow = new Date(lesson.startTime) < new Date() && new Date(lesson.startTime).getTime() + lesson.duration * 60000 > new Date().getTime();

    return (
        <Card className="shadow-lg border-2 border-red-500 hover:shadow-xl transition-shadow duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-extrabold text-red-700 line-clamp-2">{lesson.title}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${isTimeNow ? 'bg-green-600 animate-pulse' : 'bg-red-500'}`}>
                        {isTimeNow ? 'مباشر الآن' : 'مجدول'}
                    </span>
                </div>

                <p className="text-base text-gray-700 mb-4 line-clamp-2">{lesson.description}</p>
                
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-madaure-primary" />
                        <span>التاريخ والوقت: <span className="font-medium">{getStartTime(lesson.startTime)}</span></span>
                        {isToday && <span className="text-xs text-red-500 font-bold">(اليوم!)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <FiClock className="text-madaure-primary" />
                        <span>المدة: <span className="font-medium">{lesson.duration} دقيقة</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiUsers className="text-madaure-primary" />
                        <span>الأستاذ: <span className="font-medium">{teacherName}</span></span>
                    </div>
                </div>
            </div>
            
            <div className="border-t p-4 flex justify-end items-center bg-red-50 rounded-b-xl">
                <Link href={`/dashboard/lessons/${lesson._id}`} passHref legacyBehavior>
                    <Button variant={isTimeNow ? 'primary' : 'secondary'} className="flex items-center gap-2">
                        <FiPlay /> {isTimeNow ? 'انضم الآن' : 'عرض التفاصيل'}
                    </Button>
                </Link>
            </div>
        </Card>
    );
};


const LiveLessonsPage = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                // Utilise l'API pour obtenir toutes les leçons
                const response = await api.get('/lessons'); 
                
                // Filtre côté client pour n'afficher que les leçons futures ou actuelles en direct
                const liveLessons = response.data.filter(l => 
                    l.isLive && new Date(l.startTime).getTime() + l.duration * 60000 > new Date().getTime()
                ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Trier par heure de début
                
                setLessons(liveLessons);
                setError(null);
            } catch (err) {
                setError("فشل في تحميل قائمة الدروس المباشرة. يرجى التحقق من اتصال الخادم.");
                console.error("API Error fetching live lessons:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    if (loading) return (
        <div dir="rtl" className="flex items-center justify-center h-48 text-madaure-primary">
            <FiLoader className="animate-spin text-3xl ml-3" /> جاري تحميل قائمة الدروس المباشرة...
        </div>
    );
    
    return (
        <div dir="rtl" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <FiMonitor /> الدروس المباشرة القادمة
            </h2>

            <p className="text-gray-600">هنا ستجد جميع الدروس المجدولة للتفاعل المباشر.</p>

            {error && <Alert type="error" message={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessons.length === 0 && !error ? (
                    <Alert type="info" message="لا توجد دروس مباشرة مجدولة حالياً." />
                ) : (
                    lessons.map(lesson => <LiveLessonCard key={lesson._id} lesson={lesson} />)
                )}
            </div>
        </div>
    );
};

export default LiveLessonsPage;