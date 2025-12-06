// client/app/dashboard/page.jsx
import StatsCards from '@/components/dashboard/StatsCards';
import UpcomingLessons from '@/components/dashboard/UpcomingLessons';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProgressChart from '@/components/dashboard/ProgressChart';
import QuickActions from '@/components/dashboard/QuickActions'; // <-- Composant d'actions rapides

const DashboardHomePage = () => {
  return (
    <div dir="rtl" className="space-y-8">
      
      {/* 1. Cartes de Statistiques */}
      <StatsCards />
      
      {/* 2. Actions Rapides (Intégration du composant QuickActions) */}
      <QuickActions />

      {/* 3. Section Principale : Leçons, Activité et Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leçons à Venir & Graphique (2/3 de la largeur) */}
        <div className="lg:col-span-2 space-y-6">
           <UpcomingLessons />
           <ProgressChart /> 
        </div>
        
        {/* Activité Récente (1/3 de la largeur) */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;