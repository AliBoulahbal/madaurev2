// client/components/dashboard/Sidebar.jsx
'use client'

import React from 'react';
// =======================================================================
// SUBSTITUTION DES IMPORTS NON RÉSOLUS (À RETIRER EN PRODUCTION)
// En production, décommenter les imports Next.js et alias ci-dessous:
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useAuth } from '@/contexts/AuthContext' 
// import { useNotifications } from '@/contexts/NotificationContext'; 

// Mocks nécessaires à la compilation (à supprimer en production)
const Link = ({ href, children, ...props }) => <a href={href} onClick={(e) => { e.preventDefault(); console.log('Navigation to:', href); }} {...props}>{children}</a>;
const usePathname = () => '/dashboard/lessons';
const useAuth = () => ({ 
    user: { name: 'أحمد علي', role: 'student' }, 
    logout: () => console.log('Logout simulated'),
    isAuthenticated: true,
});
const useNotifications = () => ({ 
    unreadCount: 3, 
    loading: false, // Simule des notifications prêtes
});
// =======================================================================

// Icônes Lucide (utilisées pour la compilation)
import { 
  Home, 
  Video, 
  BookOpen, 
  Users, 
  MessageSquare,
  CreditCard,
  Bell,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Wrench, // CORRECTION : Remplacement de 'Tool' par 'Wrench'
  X,
  Loader 
} from 'lucide-react'

// Helper pour traduire le rôle
const getRoleArabic = (role) => {
    switch (role) {
        case 'admin': return 'مسؤول';
        case 'teacher': return 'أستاذ';
        default: return 'طالب';
    }
};

// Ajout des props (isMobileMenuOpen, setIsMobileMenuOpen) pour la gestion mobile
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  // UTILISATION DU HOOK DE NOTIFICATION (MOCKÉ)
  const { unreadCount, loading: notificationsLoading } = useNotifications(); 
  
  const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

  // Définition des éléments du menu en arabe
  const baseMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <Home className="w-5 h-5" />, href: '/dashboard' },
    { id: 'lessons', label: 'جميع الدروس', icon: <BookOpen className="w-5 h-5" />, href: '/dashboard/lessons' },
    { id: 'live-lessons', label: 'الدروس المباشرة', icon: <Video className="w-5 h-5" />, href: '/dashboard/live-lessons' },
    { id: 'summaries', label: 'ملخصات الثالثة الثانوي', icon: <BookOpen className="w-5 h-5" />, href: '/dashboard/summaries' },
    { id: 'communication', label: 'التواصل مع الأساتذة', icon: <MessageSquare className="w-5 h-5" />, href: '/dashboard/communication' },
  ];
  
  const utilityMenuItems = [
    { id: 'subscription', label: 'إدارة الإشتراك', icon: <CreditCard className="w-5 h-5" />, href: '/dashboard/subscription' },
    // Icône Bell utilisée ici
    { id: 'notifications', label: 'الإشعارات', icon: <Bell className="w-5 h-5" />, href: '/dashboard/notifications' }, 
    { id: 'faq', label: 'الأسئلة الشائعة', icon: <HelpCircle className="w-5 h-5" />, href: '/dashboard/faq' },
    { id: 'support', label: 'طلب مساعدة', icon: <LifeBuoy className="w-5 h-5" />, href: '/dashboard/support' },
  ];

  const adminMenuItems = [
      // CORRECTION : Utilisation de Wrench pour l'icône Tool
      { id: 'admin', label: 'لوحة تحكم المسؤول', icon: <Wrench className="w-5 h-5" />, href: '/admin' } 
  ];

  const menuItems = [
    ...baseMenuItems,
    ...utilityMenuItems,
    ...(isAdminOrTeacher ? adminMenuItems : []),
  ];

  const isActive = (href) => pathname === href;
  
  const handleLinkClick = () => {
    if (setIsMobileMenuOpen) {
        setIsMobileMenuOpen(false);
    }
  };

  // Le logo doit être un composant ou un chemin d'image réel.
  const Logo = () => (
      <h1 className="text-2xl font-extrabold text-red-600 tracking-wider">مادور</h1>
  );

  return (
    <div 
        className={`w-64 bg-gray-900 text-white border-l border-gray-700 flex-shrink-0 h-screen sticky top-0 overflow-y-auto flex-col z-50 transition-transform transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0 md:flex`} 
        dir="rtl"
    >
      
      {/* Bouton de Fermeture Mobile (uniquement sur mobile) */}
      <div className="md:hidden flex justify-end p-4 border-b border-gray-700">
         <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
            title="إغلاق القائمة"
          >
            <X className="text-2xl" />
          </button>
      </div>

      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-700">
        <Link href="/dashboard" onClick={handleLinkClick}>
          <Logo />
        </Link>
      </div>
      
      {/* Navigation principale */}
      <nav className="flex-grow p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            if (item.id === 'admin' && !isAdminOrTeacher) return null; 

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors text-base ${
                    isActive(item.href)
                      ? 'bg-red-700 text-white font-semibold'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {/* Les icônes Lucide ne nécessitent pas de taille de police, utilisez w/h Tailwind */}
                    {item.icon} 
                    <span className="font-medium flex-1">{item.label}</span>
                  </span>
                  {/* Badge de notification (aligné à gauche en RTL) */}
                  {item.id === 'notifications' && (
                    notificationsLoading ? (
                        <Loader className="h-4 w-4 animate-spin text-red-400" />
                    ) : unreadCount > 0 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount}</span>
                    )
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Profil utilisateur et Déconnexion */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          {/* Avatar/Initiales */}
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'م'} 
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-white truncate" title={user?.name}>
              {user?.name || 'زائر'}
            </p>
            <p className="text-sm text-gray-400">
              {getRoleArabic(user?.role)}
            </p>
          </div>
          <button
            onClick={() => {
              handleLinkClick(); 
              logout();
            }}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;