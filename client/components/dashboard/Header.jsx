// client/components/dashboard/Header.jsx
'use client';

import React from 'react';
import useAuth from '@/hooks/useAuth';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import Input from '@/components/ui/Input';
// Importez Button si des boutons d'action rapide sont nécessaires.

const Header = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('ar-EG', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    // Le Header prend toute la largeur du main content
    <header 
      className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 p-4" 
      dir="rtl"
    >
      <div className="flex justify-between items-center">
        
        {/* Section de Bienvenue et Date */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800">
            مرحباً بك، {user?.name || 'مستخدم'}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {/* Affichage de la date en arabe */}
            اليوم هو: <span className="font-semibold text-madaure-primary">{today}</span>
          </p>
        </div>

        {/* Section de Recherche et Actions (Aligné à gauche en RTL) */}
        <div className="flex items-center space-x-4 space-x-reverse">
          
          {/* Barre de Recherche */}
          <div className="hidden md:block w-80">
            <div className="relative">
              {/* Le placeholder s'aligne automatiquement à droite en RTL */}
              <Input 
                type="text"
                placeholder="ابحث عن درس، أستاذ أو ملخص..."
                className="pr-10" // Padding à droite pour l'icône
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            </div>
          </div>
          
          {/* Bouton d'accès aux notifications (si non géré par la sidebar) */}
          <button
            className="p-2 text-gray-500 hover:text-madaure-primary hover:bg-red-50 rounded-full transition-colors hidden md:block"
            title="الإشعارات"
            // TODO: Ajouter la logique d'ouverture du menu des notifications
          >
            <FiBell className="text-xl" />
          </button>
          
          {/* Bouton pour Mobile (pour ouvrir/fermer la sidebar) */}
          <button
            className="p-2 text-gray-500 hover:text-madaure-primary hover:bg-red-50 rounded-full transition-colors md:hidden"
            title="القائمة"
            // TODO: Ajouter la logique pour toggler la sidebar en mobile
          >
            <FiMenu className="text-xl" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;