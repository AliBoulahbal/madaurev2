// client/components/dashboard/Header.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext'; 
import { FiSearch, FiBell, FiMenu, FiX, FiVideo, FiBook, FiUsers, FiMapPin, FiLoader } from 'react-icons/fi';
// Import d'un composant Input supposé disponible
import Input from '@/components/ui/Input'; 
import { api } from '@/lib/api';
import Link from 'next/link';

// Composant de carte de résultat de recherche
const SearchResultItem = ({ result, onClick }) => {
    let Icon;
    let subjectDetail = result.subject;

    switch (result.type) {
        case 'lesson':
            Icon = FiVideo;
            break;
        case 'summary':
            Icon = FiBook;
            break;
        case 'teacher':
            Icon = FiUsers;
            subjectDetail = `فرع: ${result.subject}`;
            break;
        default:
            Icon = FiMapPin;
    }

    return (
        <Link href={result.link} onClick={onClick}>
            <div className="flex items-center justify-between p-3 hover:bg-red-50 transition-colors cursor-pointer rounded-lg">
                <div className="flex items-center gap-3">
                    <Icon className="text-xl text-madaure-primary" />
                    <div>
                        <p className="font-semibold text-gray-800">{result.title}</p>
                        <p className="text-xs text-gray-500">{subjectDetail}</p>
                    </div>
                </div>
                <span className="text-xs text-madaure-primary bg-red-100 px-2 py-0.5 rounded-full">
                    {result.type === 'lesson' ? 'درس' : result.type === 'summary' ? 'ملخص' : 'أستاذ'}
                </span>
            </div>
        </Link>
    );
};


const Header = ({ setIsMobileMenuOpen }) => { 
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchBoxRef = useRef(null);

  // Fermer les résultats si l'utilisateur clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchBoxRef]);


  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);

    try {
      // Appel à l'API de recherche
      const response = await api.get('/search', { params: { q: query } }); 
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Search API Error:", error);
      if(error.response && error.response.data.message) {
         setSearchResults([{ type: 'error', title: 'خطأ', subject: error.response.data.message, link: '#' }]);
      } else {
         setSearchResults([]);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Logique de debounce
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }

    if (value.length < 2) {
        setSearchResults([]);
        return;
    }

    searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value);
    }, 300); 
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }
  };

  // Formatage de la date en Arabe
  const today = new Date().toLocaleDateString('ar', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
  });

  return (
    // Le Header est sticky en haut
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

        {/* Section de Recherche et Actions */}
        <div className="flex items-center space-x-4 space-x-reverse">
          
          {/* Barre de Recherche avec Résultats */}
          {/* Masqué sur mobile, visible sur md: */}
          <div ref={searchBoxRef} className="hidden md:block w-80 relative"> 
            <div className="relative">
              <Input 
                type="text"
                placeholder="ابحث عن درس، أستاذ أو ملخص..."
                className="pr-10 pl-10" 
                value={searchTerm}
                onChange={handleInputChange}
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              
              {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
                    title="مسح البحث"
                >
                    <FiX />
                </button>
              )}
            </div>

            {/* Liste Déroulante des Résultats */}
            {(searchLoading || searchResults.length > 0) && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg p-3 z-20">
                    {searchLoading ? (
                        <div className="flex items-center justify-center p-3 text-madaure-primary">
                            <FiLoader className="animate-spin ml-2" /> جاري البحث...
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-1">
                            {searchResults.map((result, index) => (
                                <SearchResultItem 
                                    key={index} 
                                    result={result} 
                                    onClick={() => setSearchResults([])} 
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="p-3 text-gray-500 text-center">لا توجد نتائج مطابقة.</p>
                    )}
                </div>
            )}

          </div>
          
          {/* Bouton d'accès aux notifications */}
          <button
            className="p-2 text-gray-500 hover:text-madaure-primary hover:bg-red-50 rounded-full transition-colors hidden md:block"
            title="الإشعارات"
          >
            <FiBell className="text-xl" />
          </button>
          
          {/* Bouton Menu pour Mobile (visible uniquement sur les petits écrans) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)} // Ouvre la sidebar mobile
            className="p-2 text-gray-500 hover:text-madaure-primary hover:bg-red-50 rounded-full transition-colors md:hidden"
            title="القائمة"
          >
            <FiMenu className="text-xl" />
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;