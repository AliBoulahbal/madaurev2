// client/app/dashboard/layout.jsx
'use client';

import React, { useEffect, useState } from 'react';
// =======================================================================
// SUBSTITUTION DES IMPORTS NON RÉSOLUS (À RETIRER EN PRODUCTION)
// =======================================================================
// import { useAuth } from '@/contexts/AuthContext'; 
// import { useRouter } from 'next/navigation'; 
// import { NotificationProvider } from '@/contexts/NotificationContext'; 
// import Sidebar from '@/components/dashboard/Sidebar'; 
// import Header from '@/components/dashboard/Header'; 

// Mocks nécessaires à la compilation (à supprimer en production)
const useRouter = () => ({ push: (path) => console.log('Navigation simulée vers:', path) });
const useAuth = () => {
    // Simule un utilisateur Admin (pour tester l'accès admin)
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

// Icônes Lucide (utilisées pour la compilation)
import { Loader } from 'lucide-react'; 

// Composant Layout du Dashboard
export default function DashboardLayout({ children }) {
  // CORRECTION DU DESTRUCTURING : Inclus maintenant 'user' qui est utilisé dans l'useEffect
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
    
    // 3. ** LOGIQUE CLÉ DE REDIRECTION **
    // Si l'utilisateur est Admin/Teacher et qu'il est dans le dashboard standard (/dashboard)
    // On le redirige vers le panel /admin
    if (user?.role === 'admin' || user?.role === 'teacher') {
        const path = window.location.pathname;
        // Vérifie si le chemin actuel n'est PAS dans le panneau d'administration
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
        // Encapsuler dans NotificationProvider pour rendre le contexte accessible
        <NotificationProvider> 
          <div className="flex min-h-screen bg-gray-50 relative" dir="rtl"> 
            
            {/* 1. Sidebar (Fixe sur desktop, mobile coulissant) */}
            <Sidebar 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen} 
            /> 

            {/* Overlay mobile quand le menu est ouvert (visible uniquement sur les petits écrans) */}
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}

            {/* 2. Conteneur Principal */}
            {/* md:mr-64 : Marge à droite pour laisser l'espace à la sidebar FIXE sur desktop */}
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
  
  // Si l'utilisateur n'est pas authentifié et le chargement est terminé, retourne null
  return null;
}