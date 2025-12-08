// client/components/dashboard/AdminDashboardSection.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiBookOpen, FiDollarSign, FiBarChart2, FiBook, FiSettings, FiUserPlus, FiFileText } from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api'; 
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboardSection = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
                setError(null);
            } catch (err) {
                console.error("Erreur stats admin:", err);
                setError("Impossible de charger les statistiques admin");
                // Mock data pour le développement
                setStats({
                    users: { totalUsers: 150, totalStudents: 120, totalTeachers: 30 },
                    content: { totalLessons: 45, totalSummaries: 20, avgCompletionRate: 75 },
                    subscriptions: { totalActiveSubscriptions: 89 }
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const adminStats = [
        { id: 1, label: 'إجمالي المستخدمين', value: stats?.users?.totalUsers || '0', icon: FiUsers, color: 'text-blue-500' },
        { id: 2, label: 'الدروس المنشورة', value: stats?.content?.totalLessons || '0', icon: FiBook, color: 'text-green-500' },
        { id: 3, label: 'الإشتراكات النشطة', value: stats?.subscriptions?.totalActiveSubscriptions || '0', icon: FiDollarSign, color: 'text-yellow-500' },
        { id: 4, label: 'معدل الإكمال', value: `${stats?.content?.avgCompletionRate || '0'}%`, icon: FiBarChart2, color: 'text-red-500' },
    ];

    const adminActions = [
        { 
            id: 'users', 
            label: 'إدارة المستخدمين', 
            icon: FiUserPlus, 
            href: '/admin/users',
            description: 'إدارة حسابات الطلاب والأساتذة'
        },
        { 
            id: 'lessons', 
            label: 'إضافة درس جديد', 
            icon: FiBookOpen, 
            href: '/admin/lessons/create',
            description: 'إنشاء دروس تفاعلية'
        },
        { 
            id: 'summaries', 
            label: 'تحميل ملخص', 
            icon: FiFileText, 
            href: '/admin/summaries/upload',
            description: 'إضافة ملخصات PDF'
        },
        { 
            id: 'settings', 
            label: 'الإعدادات', 
            icon: FiSettings, 
            href: '/admin/settings',
            description: 'إعدادات النظام'
        },
    ];

    return (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-8 border border-red-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FiSettings className="text-red-600" />
                        لوحة التحكم الإدارية
                    </h2>
                    <p className="text-gray-600">
                        مرحباً بك يا {user?.name} ({user?.role === 'admin' ? 'مسؤول' : 'أستاذ'})
                    </p>
                </div>
                <Link 
                    href="/admin/dashboard" 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    لوحة التحكم الكاملة
                </Link>
            </div>

            {error && <Alert type="error" message={error} className="mb-4" />}

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {adminStats.map((stat) => (
                    <Card key={stat.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {loading ? '...' : stat.value}
                                </p>
                            </div>
                            <stat.icon className={`text-3xl ${stat.color}`} />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Actions rapides admin */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">الإجراءات السريعة</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {adminActions.map((action) => (
                    <Link 
                        key={action.id} 
                        href={action.href}
                        className="no-underline"
                    >
                        <Card className="p-4 hover:bg-red-50 cursor-pointer transition-all duration-200 h-full">
                            <div className="flex flex-col items-center text-center">
                                <action.icon className="text-2xl text-red-600 mb-2" />
                                <h4 className="font-semibold text-gray-800">{action.label}</h4>
                                <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardSection;