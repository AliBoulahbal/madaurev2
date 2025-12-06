// client/app/admin/dashboard/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiUsers, FiBookOpen, FiDollarSign, FiBarChart2, FiBook, FiLoader } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api'; 
import Link from 'next/link'; 

const AdminDashboardPage = () => {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';
    
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [statsError, setStatsError] = useState(null);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isAdminOrTeacher)) {
            router.push('/dashboard'); 
        }
    }, [authLoading, isAuthenticated, isAdminOrTeacher, router]);
    
    useEffect(() => {
        if (isAdminOrTeacher) {
            const fetchStats = async () => {
                try {
                    const response = await api.get('/admin/stats');
                    setStats(response.data);
                    setStatsError(null);
                } catch (err) {
                    setStatsError("Échec du chargement des statistiques.");
                    console.error("Admin Stats Fetch Error:", err);
                } finally {
                    setLoadingStats(false);
                }
            };
            fetchStats();
        }
    }, [isAdminOrTeacher]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FiLoader className="animate-spin text-4xl text-madaure-primary" />
            </div>
        );
    }
    
    if (!isAdminOrTeacher) {
        return (
             <Alert type="error" message="403 Accès refusé" className="mt-8" />
        );
    }

    const adminStats = [
        { id: 1, label: 'إجمالي المستخدمين', value: stats?.users?.totalUsers || '0', icon: FiUsers, color: 'text-blue-500' },
        { id: 2, label: 'الدروس المنشورة', value: stats?.content?.totalLessons || '0', icon: FiBook, color: 'text-green-500' },
        { id: 3, label: 'الإشتراكات النشطة', value: stats?.subscriptions?.totalActiveSubscriptions || '0', icon: FiDollarSign, color: 'text-yellow-500' },
        { id: 4, label: 'معدل الإكمال', value: `${stats?.content?.avgCompletionRate || '0'}%`, icon: FiBarChart2, color: 'text-red-500' },
    ];

    return (
        <div dir="rtl" className="space-y-8 p-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">لوحة التحكم الإدارية</h1>
            <p className="text-gray-600">
                مرحباً بك يا {user?.name}
            </p>
            
            {statsError && <Alert type="error" message={statsError} className="mb-4" />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {adminStats.map(stat => (
                    <Card key={stat.id} className="p-5 flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {loadingStats ? <FiLoader className="animate-spin" /> : stat.value}
                            </p>
                        </div>
                        <stat.icon className={`text-4xl ${stat.color} opacity-70`} />
                    </Card>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 pt-4">إدارة المحتوى والدروس</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. CRÉATION DE LEÇON */}
                <Link 
                    href="/admin/lessons/create" 
                    className="no-underline block w-full"
                >
                    <Card className="p-5 hover:bg-red-50 shadow-lg cursor-pointer transition-all duration-200 h-full">
                        <h3 className="font-semibold text-lg text-madaure-primary">إضافة درس جديد</h3>
                        <p className="text-gray-600 text-sm mt-1">إنشاء دروس تفاعلية ومحتوى تعليمي.</p>
                    </Card>
                </Link>

                {/* 2. TÉLÉCHARGEMENT DE RÉSUMÉ */}
                <Link 
                    href="/admin/summaries/upload" 
                    className="no-underline block w-full"
                >
                    <Card className="p-5 hover:bg-red-50 shadow-lg cursor-pointer transition-all duration-200 h-full">
                        <h3 className="font-semibold text-lg text-madaure-primary">تحميل ملخص (PDF)</h3>
                        <p className="text-gray-600 text-sm mt-1">إضافة وثائق وملخصات قابلة للتحميل.</p>
                    </Card>
                </Link>

                {/* 3. GESTION DES UTILISATEURS - SOLUTION GARANTIE */}
                <Link 
                    href="/admin/users" 
                    className="no-underline block w-full"
                >
                    <Card className="p-5 hover:bg-red-50 shadow-lg cursor-pointer transition-all duration-200 h-full">
                        <h3 className="font-semibold text-lg text-madaure-primary">إدارة المستخدمين</h3>
                        <p className="text-gray-600 text-sm mt-1">مراجعة حسابات الطلاب والأساتذة.</p>
                    </Card>
                </Link>
            </div>

           
        </div>
    );
};

export default AdminDashboardPage;