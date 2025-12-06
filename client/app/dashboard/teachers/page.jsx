// client/app/dashboard/teachers/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';
import { FiUsers, FiBookOpen, FiMail, FiLoader } from 'react-icons/fi';

const TeachersListPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // Utilise la nouvelle route pour obtenir uniquement les enseignants
                const response = await api.get('/users/teachers'); 
                setTeachers(response.data);
                setError(null);
            } catch (err) {
                setError("فشل في تحميل قائمة الأساتذة. يرجى التحقق من اتصال الخادم.");
                console.error("API Error fetching teachers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const TeacherCard = ({ teacher }) => (
        <Card className="flex flex-col items-center p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 bg-madaure-light rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {teacher.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <FiBookOpen className="text-madaure-primary" /> {teacher.branch}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <FiMail className="text-gray-400" /> {teacher.email}
            </p>
            {/* Lien simulé vers la page de profil/communication */}
            <button className="mt-4 text-madaure-primary hover:text-red-700 font-medium text-sm">
                تواصل الآن
            </button>
        </Card>
    );

    if (loading) return (
        <div dir="rtl" className="flex items-center justify-center h-48 text-madaure-primary">
            <FiLoader className="animate-spin text-3xl ml-3" /> جاري تحميل قائمة الأساتذة...
        </div>
    );
    
    return (
        <div dir="rtl" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FiUsers /> قائمة الأساتذة
            </h2>
            <p className="text-gray-600">اكتشف أساتذتنا المؤهلين حسب فروع الدراسة.</p>

            {error && <Alert type="error" message={error} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teachers.length === 0 && !error ? (
                    <Alert type="info" message="لا يوجد أساتذة متاحون حالياً." />
                ) : (
                    teachers.map(teacher => <TeacherCard key={teacher._id} teacher={teacher} />)
                )}
            </div>
        </div>
    );
};

export default TeachersListPage;