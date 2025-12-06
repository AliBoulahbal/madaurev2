'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { FiLoader } from 'react-icons/fi';

// Composant Layout du Dashboard
export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const router = useRouter();
  // État pour gérer l'ouverture/fermeture du menu sur mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  useEffect(() => {
    // Si l'authentification est toujours en cours de chargement, attendez
    if (loading) return; 

    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      router.push('/login');
    }
    
  }, [isAuthenticated, loading, router, checkAuth]);

  // Affichage du chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-madaure-primary" />
        <p className="text-lg text-gray-600 mr-3">تحقق من بيانات الإشتراك...</p>
      </div>
    );
  }

  // Affichage du Layout si l'utilisateur est authentifié
  return (
    // 'relative' est important pour l'overlay mobile
    <div className="flex min-h-screen bg-gray-50 relative" dir="rtl"> 
      
      {/* 1. Sidebar (Fixe sur desktop, mobile coulissant) */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      /> 

      {/* Overlay mobile quand le menu est ouvert (visible uniquement sur les petits écrans) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* 2. Conteneur Principal */}
      {/* md:mr-64 : Marge à droite pour laisser l'espace à la sidebar FIXE sur desktop */}
      <div className="flex flex-col flex-1 w-full md:mr-64"> 
        
        {/* Header (doit transmettre setIsMobileMenuOpen pour le bouton Menu) */}
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} /> 

        {/* Contenu des pages enfants */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}