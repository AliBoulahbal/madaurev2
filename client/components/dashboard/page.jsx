// client/app/dashboard/page.jsx (Final)
import StatsCards from '@/components/dashboard/StatsCards';
import UpcomingLessons from '@/components/dashboard/UpcomingLessons';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProgressChart from '@/components/dashboard/ProgressChart'; // Composant à développer si nécessaire
import QuickActions from '@/components/dashboard/QuickActions'; // Composant à développer si nécessaire

const DashboardHomePage = () => {
  return (
    <div dir="rtl" className="space-y-8">
      
      {/* 1. Cartes de Statistiques */}
      <StatsCards />

      {/* 2. Section Principale : Leçons, Activité et Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leçons à Venir (2/3 de la largeur) */}
        <div className="lg:col-span-2 space-y-6">
           <UpcomingLessons />
           {/* Placeholder pour le graphique de progression (ProgressChart) */}
           {/* <ProgressChart /> */}
        </div>
        
        {/* Activité Récente (1/3 de la largeur) */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
      
      {/* 3. Section d'Actions Rapides (Optionnel) */}
      {/* <QuickActions /> */}
      
    </div>
  );
};

export default DashboardHomePage;