// client/components/dashboard/Sidebar.jsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useAuth from '@/hooks/useAuth' // Utilisation du hook useAuth
import Image from 'next/image' // Pour le logo
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
  FiLogOut
} from 'react-icons/fi'

const Sidebar = () => {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: <FiHome />, href: '/dashboard' },
    { id: 'live-lessons', label: 'الدروس المباشرة', icon: <FiVideo />, href: '/dashboard/live-lessons' },
    { id: 'summaries', label: 'ملخصات الثالثة الثانوي', icon: <FiBook />, href: '/dashboard/summaries' },
    { id: 'teachers', label: 'الأساتذة', icon: <FiUsers />, href: '/dashboard/teachers' },
    { id: 'communication', label: 'فضاء التواصل', icon: <FiMessageSquare />, href: '/dashboard/communication' },
    { id: 'subscription', label: 'الإشتراك', icon: <FiCreditCard />, href: '/dashboard/subscription' },
    { id: 'notifications', label: 'الإشعارات', icon: <FiBell />, href: '/dashboard/notifications' },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: <FiHelpCircle />, href: '/dashboard/faq' },
    { id: 'support', label: 'الدعم', icon: <FiLifeBuoy />, href: '/dashboard/support' },
  ]
  
  // Fonction pour déterminer le rôle en arabe
  const getRoleArabic = (role) => {
    switch (role) {
      case 'student':
        return 'طالب';
      case 'teacher':
        return 'أستاذ';
      case 'admin':
        return 'مدير';
      default:
        return 'مستخدم';
    }
  };

  return (
    // Utilisez `dir="rtl"` pour forcer la direction Right-to-Left
    // `border-l` devient `border-r` et `right-0` positionne à droite
    <div 
      className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed right-0 top-0"
      dir="rtl"
    >
      {/* Logo MADAURE */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Logo basé sur l'image fournie (assurez-vous que /public/logo.png est disponible) */}
          <Image
            src="/logo.png" 
            alt="MADAURE Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">مادور</h2>
            <p className="text-xs text-gray-500">منصة التعليم الذكي</p>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-madaure-primary text-white' // Utilisation de la couleur MADAURE
                      : 'text-gray-700 hover:bg-red-50 hover:text-madaure-primary' // Survol MADAURE
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium flex-1">{item.label}</span>
                  {/* Badge de notification (aligné à gauche en RTL) */}
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
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-madaure-light rounded-full flex items-center justify-center text-white font-bold">
            {/* Affiche la première lettre du nom */}
            {user?.name?.charAt(0) || 'م'} 
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-gray-900 truncate" title={user?.name}>
              {user?.name || 'زائر'}
            </p>
            <p className="text-sm text-gray-500">
              {getRoleArabic(user?.role)}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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