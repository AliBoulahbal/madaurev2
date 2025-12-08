// client/app/dashboard/page.jsx
'use client';

import StatsCards from '@/components/dashboard/StatsCards';
import UpcomingLessons from '@/components/dashboard/UpcomingLessons';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProgressChart from '@/components/dashboard/ProgressChart';
import QuickActions from '@/components/dashboard/QuickActions';
import { useDashboard } from '@/hooks/useDashboard';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';

const DashboardHomePage = () => {
  const {
    stats,
    upcomingLessons,
    recentActivity,
    progress,
    loading,
    error,
    refreshData
  } = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FiLoader className="animate-spin text-4xl text-madaure-primary" />
        <p className="mr-3 text-gray-600">جاري تحميل البيانات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <FiAlertCircle className="text-5xl text-red-500 mb-4" />
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-madaure-primary text-white rounded hover:bg-madaure-dark"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-8">
      {/* 1. Cartes de Statistiques avec données réelles */}
      <StatsCards stats={stats} />
      
      {/* 2. Actions Rapides */}
      <QuickActions />

      {/* 3. Section Principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <UpcomingLessons lessons={upcomingLessons} />
           <ProgressChart data={progress} /> 
        </div>
        
        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;