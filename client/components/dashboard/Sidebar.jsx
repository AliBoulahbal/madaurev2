// client/components/dashboard/Sidebar.jsx - VERSION COMPLÈTE
'use client'

import React from 'react';
// =======================================================================
// CHOISIR UNE SEULE OPTION
// OPTION 1: IMPORTS RÉELS (POUR PRODUCTION)
// =======================================================================
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext' 
import { useNotifications } from '@/contexts/NotificationContext'; 

// =======================================================================
// OPTION 2: MOCKS (POUR DÉVELOPPEMENT - À SUPPRIMER EN PRODUCTION)
// =======================================================================
/*
// Mocks (décommentez si les imports réels ne fonctionnent pas)
const MockLink = ({ href, children, ...props }) => <a href={href} onClick={(e) => { e.preventDefault(); console.log('Navigation to:', href); }} {...props}>{children}</a>;
const mockUsePathname = () => '/dashboard/lessons';
const mockUseAuth = () => ({ 
    user: { name: 'أحمد علي', role: 'admin' }, 
    logout: () => console.log('Logout simulated'),
    isAuthenticated: true,
});
const mockUseNotifications = () => ({ 
    unreadCount: 3, 
    loading: false,
});

// Utiliser les mocks
const Link = MockLink;
const usePathname = mockUsePathname;
const useAuth = mockUseAuth;
const useNotifications = mockUseNotifications;
*/
// =======================================================================

// Icônes Lucide
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
  Wrench,
  FileText,
  Settings,
  BarChart3,
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

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const { unreadCount, loading: notificationsLoading } = useNotifications(); 
  
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isAdminOrTeacher = isAdmin || isTeacher;

  // ============================================
  // DÉFINITION DES MENUS - UNE SEULE FOIS
  // ============================================
  
  // Menu de base pour tous les utilisateurs
  const baseMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <Home className="w-5 h-5" />, href: '/dashboard' },
    { id: 'lessons', label: 'جميع الدروس', icon: <BookOpen className="w-5 h-5" />, href: '/dashboard/lessons' },
    { id: 'live-lessons', label: 'الدروس المباشرة', icon: <Video className="w-5 h-5" />, href: '/dashboard/live-lessons' },
    { id: 'summaries', label: 'ملخصات الثالثة الثانوي', icon: <BookOpen className="w-5 h-5" />, href: '/dashboard/summaries' },
    { id: 'communication', label: 'التواصل مع الأساتذة', icon: <MessageSquare className="w-5 h-5" />, href: '/dashboard/communication' },
  ];
  
  // Menu utilitaire pour tous les utilisateurs
  const utilityMenuItems = [
    { id: 'subscription', label: 'إدارة الإشتراك', icon: <CreditCard className="w-5 h-5" />, href: '/dashboard/subscription' },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell className="w-5 h-5" />, href: '/dashboard/notifications' }, 
    { id: 'faq', label: 'الأسئلة الشائعة', icon: <HelpCircle className="w-5 h-5" />, href: '/dashboard/faq' },
    { id: 'support', label: 'طلب مساعدة', icon: <LifeBuoy className="w-5 h-5" />, href: '/dashboard/support' },
  ];

  // Menu admin/teacher - UNIQUEMENT SI L'UTILISATEUR A LES DROITS
  const adminMenuItems = isAdminOrTeacher ? [
    // Section administration (visible seulement pour admin/teacher)
    { id: 'admin-divider', type: 'divider', label: 'الإدارة' },
    
    // OPTION 1: Lien vers dashboard admin complet
    { id: 'admin-dashboard', label: 'لوحة التحكم الإدارية', icon: <Wrench className="w-5 h-5" />, href: '/admin/dashboard' },
    
    // OPTION 2: Lien vers dashboard avec paramètre admin (si intégré)
    // { id: 'admin-dashboard', label: 'لوحة التحكم الإدارية', icon: <Wrench className="w-5 h-5" />, href: '/dashboard?view=admin' },
    
    // Sous-menu administration
    { id: 'admin-users', label: 'إدارة المستخدمين', icon: <Users className="w-5 h-5" />, href: '/admin/users' },
    { id: 'admin-lessons', label: 'إدارة الدروس', icon: <BookOpen className="w-5 h-5" />, href: '/admin/lessons/create' },
    { id: 'admin-summaries', label: 'إدارة الملخصات', icon: <FileText className="w-5 h-5" />, href: '/admin/summaries/upload' },
    { id: 'admin-stats', label: 'الإحصائيات', icon: <BarChart3 className="w-5 h-5" />, href: '/admin/dashboard' },
    
    // Séparateur si admin (pas teacher)
    ...(isAdmin ? [
      { id: 'admin-settings-divider', type: 'divider', label: 'الإعدادات المتقدمة' },
      { id: 'admin-settings', label: 'إعدادات النظام', icon: <Settings className="w-5 h-5" />, href: '/admin/settings' }
    ] : [])
  ] : [];

  // Combinaison de tous les menus
  const menuItems = [
    ...baseMenuItems,
    ...utilityMenuItems,
    ...adminMenuItems,
  ];

  // Vérifier si un lien est actif
  const isActive = (href) => {
    if (href.includes('?')) {
      // Pour les liens avec paramètres, comparer seulement la partie avant '?'
      return pathname === href.split('?')[0];
    }
    return pathname === href;
  };
  
  // Fermer le menu mobile lors d'un clic
  const handleLinkClick = () => {
    if (setIsMobileMenuOpen) {
        setIsMobileMenuOpen(false);
    }
  };

  // Composant Logo
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
        <p className="text-sm text-gray-400 mt-1">منصة التعليم الإلكتروني</p>
      </div>
      
      {/* Navigation principale */}
      <nav className="flex-grow p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            // Ne pas afficher les éléments admin si l'utilisateur n'a pas les droits
            if (item.id.startsWith('admin-') && !isAdminOrTeacher) return null;
            
            // Gérer les séparateurs
            if (item.type === 'divider') {
              return (
                <li key={item.id} className="pt-4 pb-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                    {item.label}
                  </div>
                </li>
              );
            }

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
                    {item.icon} 
                    <span className="font-medium flex-1">{item.label}</span>
                  </span>
                  
                  {/* Badge de notification pour l'item notifications */}
                  {item.id === 'notifications' && (
                    notificationsLoading ? (
                        <Loader className="h-4 w-4 animate-spin text-red-400" />
                    ) : unreadCount > 0 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
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
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">
                {getRoleArabic(user?.role)}
              </p>
              {isAdmin && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">مسؤول</span>
              )}
              {isTeacher && !isAdmin && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">أستاذ</span>
              )}
            </div>
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
        
        {/* Information supplémentaire pour admin */}
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              <span className="font-medium">صلاحيات كاملة:</span> يمكنك الوصول إلى جميع أقسام الإدارة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;