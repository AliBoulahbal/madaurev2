'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext' 
import Image from 'next/image' 
import { 
  FiHome, 
  FiVideo, 
  FiBook, 
  FiUsers, 
  FiMessageSquare,
  FiCreditCard,
  FiBell,
  FiHelpCircle,
  FiLifeBuoy,
  FiLogOut,
  FiTool, 
  FiX
} from 'react-icons/fi'

// Ajout des props pour la gestion du menu mobile
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  
  const isAdminOrTeacher = user?.role === 'admin' || user?.role === 'teacher';

  // Définition des éléments du menu en arabe
  const baseMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <FiHome />, href: '/dashboard' },
    { id: 'lessons', label: 'جميع الدروس', icon: <FiBook />, href: '/dashboard/lessons' },
    { id: 'live-lessons', label: 'الدروس المباشرة', icon: <FiVideo />, href: '/dashboard/live-lessons' },
    { id: 'summaries', label: 'ملخصات الثالثة الثانوي', icon: <FiBook />, href: '/dashboard/summaries' },
    { id: 'teachers', label: 'الأساتذة', icon: <FiUsers />, href: '/dashboard/teachers' },
    { id: 'communication', label: 'فضاء التواصل', icon: <FiMessageSquare />, href: '/dashboard/communication' },
    { id: 'subscription', label: 'الإشتراك', icon: <FiCreditCard />, href: '/dashboard/subscription' },
    { id: 'notifications', label: 'الإشعارات', icon: <FiBell />, href: '/dashboard/notifications' },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: <FiHelpCircle />, href: '/dashboard/faq' },
    { id: 'support', label: 'الدعم', icon: <FiLifeBuoy />, href: '/dashboard/support' },
  ];

  const adminMenuItem = { id: 'admin', label: 'إدارة المحتوى', icon: <FiTool />, href: '/admin/dashboard' };
  
  const menuItems = isAdminOrTeacher 
    ? [baseMenuItems[0], adminMenuItem, ...baseMenuItems.slice(1)]
    : baseMenuItems;
  
  // Fonction pour déterminer le rôle en arabe
  const getRoleArabic = (role) => {
    switch (role) {
      case 'student': return 'طالب';
      case 'teacher': return 'أستاذ';
      case 'admin': return 'مدير';
      default: return 'مستخدم';
    }
  };

  const handleLinkClick = () => {
    // Fermer le menu après un clic sur mobile
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    // CLASSES DE RÉPONSIVITÉ CLÉS POUR LA BARRE LATÉRALE:
    // fixed top-0 right-0 z-30 : Fixé sur l'écran
    // md:block md:translate-x-0 : A partir de MD (Desktop), elle est affichée et toujours fixe.
    // ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} : Gère l'animation coulissante sur mobile
    <div 
      className={`
        w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen fixed top-0 right-0 z-30
        md:block md:translate-x-0 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'}
      `}
      dir="rtl"
    >
      {/* Bouton de fermeture mobile (visible uniquement sur mobile) */}
      <button 
        className="md:hidden absolute top-4 left-4 p-2 text-gray-300 hover:text-white z-40"
        onClick={() => setIsMobileMenuOpen(false)}
        title="إغلاق القائمة"
      >
        <FiX className="text-2xl" />
      </button>

      {/* Logo MADAURE */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png" 
            alt="MADAURE Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-xl font-bold text-white">مادور</h2>
            <p className="text-xs text-gray-400">منصة التعليم الذكي</p>
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-madaure-primary text-white shadow-md' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.id === 'notifications' && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">3</span>
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
          <div className="w-10 h-10 bg-madaure-primary rounded-full flex items-center justify-center text-white font-bold">
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
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar