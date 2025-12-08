// client/components/dashboard/StudentDashboard.jsx
'use client';

import React from 'react';
import StatsCards from './StatsCards';
import UpcomingLessons from './UpcomingLessons';
import RecentActivity from './RecentActivity';
import ProgressChart from './ProgressChart';
import QuickActions from './QuickActions';

const StudentDashboard = () => {
  return (
    <div dir="rtl" className="space-y-8">
      
      {/* 1. Cartes de Statistiques */}
      <StatsCards />
      
      {/* 2. Actions Rapides */}
      <QuickActions />

      {/* 3. Section Principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leçons à Venir & Graphique */}
        <div className="lg:col-span-2 space-y-6">
           <UpcomingLessons />
           <ProgressChart /> 
        </div>
        
        {/* Activité Récente */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;