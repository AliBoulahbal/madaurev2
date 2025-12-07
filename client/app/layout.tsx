// client/app/dashboard/layout.jsx
'use client';

import React, { useEffect, useState } from 'react';
// =======================================================================
// SUBSTITUTION DES IMPORTS NON RÉSOLUS (À RETIRER EN PRODUCTION)
// =======================================================================
// Importations réelles (à décommenter en production)
// import { useAuth } from '@/contexts/AuthContext'; 
// import { useRouter } from 'next/navigation'; 
// import { NotificationProvider } from '@/contexts/NotificationContext'; 
//import Sidebar from '@/components/dashboard/Sidebar'; 
//import Header from '@/components/dashboard/Header'; 

// Mocks nécessaires à la compilation (à supprimer en production)
const useRouter = () => ({ push: (path) => console.log('Navigation simulée vers:', path) });
const useAuth = () => {
    // Le mock doit retourner un objet complet et défini
    const user = { name: 'Admin User', role: 'admin' };
    return { 
        isAuthenticated: true, 
        loading: false, 
        user, 
        checkAuth: () => console.log('checkAuth simulated') 
    };
};
const NotificationProvider = ({ children }) => <>{children}</>;
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => (
    <div className="w-64 bg-gray-900 h-screen p-4 text-white hidden md:flex" dir="rtl">
        Sidebar Mock - Rôle: {useAuth().user.role} 
    </div>
);
const Header = ({ setIsMobileMenuOpen }) => (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between p-4" dir="rtl">
        Header Mock 
        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">Menu</button>
    </div>
);
// =======================================================================

import { Loader } from 'lucide-react'; 

/**
 * Composant Layout du Dashboard
 */
export default function DashboardLayout({ children }) {
  // Déstructuration du hook useAuth (les mocks garantissent que useAuth() retourne un objet)
  const { isAuthenticated, loading, user, checkAuth } = useAuth(); 
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  useEffect(() => {
    // 1. Attendre que l'état d'authentification soit vérifié
    if (loading) return; 

    // 2. Redirection non authentifiée
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    // 3. LOGIQUE CLÉ DE REDIRECTION DES ADMINS/PROFESSEURS vers le panneau /admin
    if (user?.role === 'admin' || user?.role === 'teacher') {
        const path = window.location.pathname;
        // Si l'utilisateur est admin/teacher mais pas sur une route /admin, rediriger.
        if (!path.startsWith('/admin')) {
            router.push('/admin');
        }
    }
    
  }, [isAuthenticated, loading, router, user, checkAuth]);

  // Affichage du chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <Loader className="animate-spin text-4xl text-red-600" />
        <p className="text-lg text-gray-600 mr-3">تحقق من بيانات الإشتراك...</p>
      </div>
    );
  }
  
  // Affichage du Layout si l'utilisateur est authentifié
  if (isAuthenticated) {
      return (
        // Encapsuler dans NotificationProvider
        <NotificationProvider> 
          <div className="flex min-h-screen bg-gray-50 relative" dir="rtl"> 
            
            {/* 1. Sidebar (Fixe sur desktop, mobile coulissant) */}
            <Sidebar 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen} 
            /> 

            {/* Overlay mobile quand le menu est ouvert */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}

            {/* 2. Conteneur Principal */}
            <div className="flex flex-col flex-1 w-full md:mr-64 z-10"> 
              
              {/* Header */}
              <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
              
              {/* Contenu de la Page */}
              <main className="p-4 sm:p-6 flex-1">
                {children}
              </main>
              
            </div>
          </div>
        </NotificationProvider>
      );
  }
  
  // Retourne null en attendant la redirection vers /login
  return null;
}