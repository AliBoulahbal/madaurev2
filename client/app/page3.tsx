// client/app/page.tsx - Version simplifiée sans imports manquants
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FiHome, FiSettings, FiUser, FiBookOpen, FiUsers, FiFileText } from 'react-icons/fi';
import StatsCards from '@/components/dashboard/StatsCards';
import UpcomingLessons from '@/components/dashboard/UpcomingLessons';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProgressChart from '@/components/dashboard/ProgressChart';
import QuickActions from '@/components/dashboard/QuickActions';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const HomePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isAdminOrTeacher = isAdmin || isTeacher;

  // Redirection si non authentifié
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div dir="rtl" className="space-y-8">
      
      {/* Section Admin/Teacher */}
      {isAdminOrTeacher && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FiSettings className="text-red-600" />
                {isAdmin ? 'لوحة التحكم الإدارية' : 'لوحة تحكم الأساتذة'}
              </h2>
              <p className="text-gray-600">مرحباً بك يا {user?.name}</p>
            </div>
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              لوحة التحكم الكاملة
            </Link>
          </div>
          
          {/* Actions rapides admin */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/users" className="no-underline">
              <Card className="p-4 hover:bg-red-50 text-center">
                <FiUsers className="text-2xl text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">المستخدمين</h4>
              </Card>
            </Link>
            <Link href="/admin/lessons/create" className="no-underline">
              <Card className="p-4 hover:bg-red-50 text-center">
                <FiBookOpen className="text-2xl text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">دروس جديدة</h4>
              </Card>
            </Link>
            <Link href="/admin/summaries/upload" className="no-underline">
              <Card className="p-4 hover:bg-red-50 text-center">
                <FiFileText className="text-2xl text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">ملخصات</h4>
              </Card>
            </Link>
            <Link href="/admin/settings" className="no-underline">
              <Card className="p-4 hover:bg-red-50 text-center">
                <FiSettings className="text-2xl text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">إعدادات</h4>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Dashboard normal */}
      <StatsCards />
      <QuickActions />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpcomingLessons />
          <ProgressChart /> 
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default HomePage;