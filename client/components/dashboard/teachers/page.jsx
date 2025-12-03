// client/app/dashboard/teachers/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import TeacherCard from '@/components/dashboard/TeacherCard';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api'; 

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/users/teachers'); // Endpoint: /api/users/teachers
        setTeachers(response.data);
        setError(null);
      } catch (err) {
        setError("فشل في تحميل قائمة الأساتذة. يرجى التأكد من اتصالك.");
        console.error("API Error fetching teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div dir="rtl" className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">قائمة الأساتذة</h2>
      <p className="text-gray-600">تعرف على خبرائنا وتواصل معهم.</p>

      {loading && (
          <div className="text-center p-8">
              <p className="text-xl text-madaure-primary">جاري تحميل الأساتذة...</p>
          </div>
      )}
      
      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && teachers.length === 0 && !error && (
            <p className="text-lg text-gray-500 col-span-full">لا يوجد أساتذة متاحون حالياً على المنصة.</p>
        )}
        {teachers.map(teacher => (
          <TeacherCard 
            key={teacher._id} 
            teacher={teacher} 
            // Assurez-vous que TeacherCard utilise les champs _id, name, subject, bio
            // (Nous utilisons 'name' et 'role' du modèle User pour simuler ici)
          />
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;