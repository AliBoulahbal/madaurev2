// client/app/dashboard/layout.jsx (Mise à jour)
'use client';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header'; // <-- Importation
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardLayout = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // ... (Logique de redirection et chargement inchangée) ...

  if (loading || !isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center text-madaure-primary text-xl">
            جاري التحميل...
        </div>
    );
  }

  return (
    <div dir="rtl" className="flex">
      <Sidebar />
      
      {/* Contenu principal. Le padding à droite (pr-64) correspond à la largeur de la Sidebar. */}
      <main className="flex-1 min-h-screen bg-gray-50 pr-64"> 
        
        {/* Intégration du Header ici */}
        <Header user={user} />
        
        {/* Contenu des pages enfants (p-8 pour l'espacement) */}
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;