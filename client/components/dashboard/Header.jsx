// client/components/dashboard/Header.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// =======================================================================
// SUBSTITUTION DES IMPORTS NON RÉSOLUS (À RETIRER EN PRODUCTION)
// En production, décommenter les imports réels :
// import { useAuth } from '@/contexts/AuthContext'; 
// import { useNotifications } from '@/contexts/NotificationContext';
// import Input from '@/components/ui/Input'; 
// import { api } from '@/lib/api'; 
// import Link from 'next/link';

// Mocks nécessaires à la compilation (à supprimer en production)
const useAuth = () => ({ 
    user: { name: 'أحمد علي', role: 'student' }, 
    isAuthenticated: true,
    // La déconnexion doit être implémentée dans votre AuthContext réel
    logout: () => console.log('Logout simulated successfully from Header. If this is not working, check your AuthContext implementation.'),
});
const useNotifications = () => ({ 
    notifications: [
        { _id: 1, message: 'بدأ درس "المتجهات" الآن.', isRead: false, type: 'lesson', link: '/lessons/1', createdAt: new Date(Date.now() - 5 * 60000) },
        { _id: 2, message: 'تم تحديث ملفك الشخصي.', isRead: false, type: 'system', link: '/subscription', createdAt: new Date(Date.now() - 10 * 60000) },
        { _id: 3, message: 'تمت إضافة ملخص جديد.', isRead: true, type: 'subscription', link: '/summaries/2', createdAt: new Date(Date.now() - 2 * 3600000) },
    ],
    unreadCount: 2, 
    loading: false,
    markAsRead: (id) => console.log(`Notification ${id} marked as read`),
});

const Input = ({ value, onChange, placeholder, className = '', ...props }) => (
    <input 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full p-2 border border-gray-300 rounded-full text-sm focus:ring-red-500 focus:border-red-500 text-right ${className}`} 
        dir="rtl" 
        {...props} 
    />
);
const api = {
    get: (url) => new Promise(resolve => {
        setTimeout(() => {
            const mockResults = [
                { type: 'lesson', title: 'مقدمة في التحليل', subject: 'الرياضيات', link: '/dashboard/lessons/456' },
                { type: 'teacher', title: 'الأستاذة مريم', subject: 'العلوم الطبيعية', link: '/dashboard/teachers/789' },
            ];
            resolve({ data: { results: mockResults } });
        }, 300);
    }),
};
// NOTE: Le mock Link bloque la navigation réelle (e.preventDefault)
const Link = ({ href, children, ...props }) => <a href={href} onClick={(e) => { e.preventDefault(); console.log('Navigation simulated to:', href); }} {...props}>{children}</a>;
// =======================================================================


// Icônes Lucide (utilisées pour la compilation)
import { 
    Search, 
    Bell, 
    Menu, 
    X, 
    Video, 
    BookOpen, 
    Users, 
    MapPin, 
    Loader, 
    ChevronLeft, 
    MessageSquare,
    Rss,
} from 'lucide-react'; 

// Composant Helper pour les icônes de notification
const NotificationIcon = ({ type }) => {
    const defaultClasses = "w-5 h-5 flex-shrink-0";
    switch (type) {
        case 'lesson': return <Video className={`${defaultClasses} text-red-600`} />;
        case 'communication': return <MessageSquare className={`${defaultClasses} text-blue-600`} />;
        case 'subscription': return <BookOpen className={`${defaultClasses} text-green-600`} />;
        case 'system':
        default: return <Rss className={`${defaultClasses} text-gray-500`} />;
    }
};

const formatTimeAgo = (date) => {
    // NOTE: Simule la fonction
    return "منذ بضع دقائق";
};

// ===========================================
// COMPOSANT NotificationDropdown (NOUVEAU)
// ===========================================
const NotificationDropdown = ({ setIsMobileMenuOpen }) => {
    const { notifications, unreadCount, loading, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Fermer le menu lors d'un clic à l'extérieur
    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    // Les 5 notifications les plus récentes (non lues en priorité)
    const sortedNotifications = [...notifications].sort((a, b) => {
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    const recentNotifications = sortedNotifications.slice(0, 5);
    
    const handleNotificationClick = (id, link) => {
        markAsRead(id);
        setIsOpen(false);
        // window.location.href = link; 
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors relative"
                title="الإشعارات"
            >
                <Bell className="w-6 h-6" /> 
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <div 
                    className="absolute left-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden" 
                    style={{ minWidth: '20rem' }}
                    dir="rtl"
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">الإشعارات ({unreadCount} جديد)</h3>
                        <Link href="/dashboard/notifications" className="text-sm text-red-600 hover:text-red-700" onClick={() => setIsOpen(false)}>
                            عرض الكل
                        </Link>
                    </div>
                    
                    <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                        {loading ? (
                            <li className="p-4 text-center text-gray-500">
                                <Loader className="animate-spin inline-block w-5 h-5 mr-2" />
                                جاري التحميل...
                            </li>
                        ) : recentNotifications.length === 0 ? (
                            <li className="p-4 text-center text-gray-500">لا توجد إشعارات حديثة.</li>
                        ) : (
                            recentNotifications.map(notif => (
                                <li 
                                    key={notif._id} 
                                    className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${!notif.isRead ? 'bg-red-50 hover:bg-red-100 font-medium' : 'hover:bg-gray-50'}`}
                                    onClick={() => handleNotificationClick(notif._id, notif.link)}
                                >
                                    <NotificationIcon type={notif.type} />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 line-clamp-2">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(notif.createdAt)}</p>
                                    </div>
                                    {!notif.isRead && (
                                        <span className="h-2 w-2 bg-red-600 rounded-full flex-shrink-0 mt-1" title="غير مقروء"></span>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="p-2 border-t text-center">
                        <Link href="/dashboard/notifications" className="text-sm text-gray-600 hover:text-red-700" onClick={() => setIsOpen(false)}>
                            عرض جميع الإشعارات
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};
// ===========================================


const Header = ({ setIsMobileMenuOpen }) => { 
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchDropdownRef = useRef(null);
  
  // Fonction utilitaire pour la recherche
  const performSearch = useCallback(async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    
    setSearchLoading(true);
    
    try {
        // APPEL API RÉEL : GET /api/search?q=query
        const response = await api.get(`/api/search?q=${query}`);
        const results = response.data.results || [];
        
        setSearchResults(results);
    } catch (error) {
        console.error("Erreur de recherche:", error);
        setSearchResults([]);
    }
    
    setSearchLoading(false);
  }, []);
  
  // Effet pour gérer le debounce de la recherche
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm, performSearch]);
  
  // Fermer la recherche lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Composant de carte de résultat de recherche (Utilise Lucide)
  const SearchResultItem = ({ result, onClick }) => {
    let Icon;
    let subjectDetail = result.subject;

    switch (result.type) {
        case 'lesson':
            Icon = Video;
            break;
        case 'summary':
            Icon = BookOpen;
            break;
        case 'teacher':
            Icon = Users;
            subjectDetail = `فرع: ${result.subject}`;
            break;
        default:
            Icon = MapPin;
    }

    return (
        <Link href={result.link} onClick={onClick}>
            <div className="flex items-center justify-between p-3 hover:bg-red-50 transition-colors cursor-pointer rounded-lg">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-red-600" />
                    <div>
                        <p className="font-semibold text-gray-800 truncate max-w-xs">{result.title}</p>
                        <p className="text-sm text-gray-500">{subjectDetail}</p>
                    </div>
                </div>
                <ChevronLeft className="h-4 w-4 text-gray-400" />
            </div>
        </Link>
    );
  };
  

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10" dir="rtl">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Section Gauche (Recherche) */}
          <div className="relative w-full max-w-md ml-4" ref={searchDropdownRef}>
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="البحث عن دروس، ملخصات، أو أساتذة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-gray-100 focus:bg-white"
            />

            {/* Menu Déroulant de Recherche */}
            {(searchLoading || searchResults.length > 0 || searchTerm.length > 0) && (
                <div className="absolute top-full w-full bg-white mt-2 rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                    {searchLoading ? (
                        <div className="flex items-center justify-center p-3 text-red-600">
                            <Loader className="animate-spin w-5 h-5 ml-2" /> جاري البحث...
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="p-1 space-y-1">
                            {searchResults.map((result, index) => (
                                <SearchResultItem 
                                    key={index} 
                                    result={result} 
                                    onClick={() => setSearchResults([])} 
                                />
                            ))}
                        </div>
                    ) : searchTerm.length > 0 && (
                        <p className="p-3 text-gray-500 text-center">لا توجد نتائج مطابقة لـ "{searchTerm}".</p>
                    )}
                </div>
            )}
          </div>
          
          {/* Section Droite (Profil & Actions) */}
          <div className="flex items-center gap-4">
            
            {/* Notification Dropdown */}
            <NotificationDropdown setIsMobileMenuOpen={setIsMobileMenuOpen} /> 
            
            {/* Profil court (nom + avatar) */}
            <Link href="/dashboard/subscription" className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-colors hidden sm:flex">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'م'} 
                </div>
                <span className="text-sm font-semibold text-gray-800 hidden lg:block">{user?.name || 'زائر'}</span>
            </Link>
          
            {/* Bouton pour Mobile (Menu) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors md:hidden"
              title="القائمة"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;