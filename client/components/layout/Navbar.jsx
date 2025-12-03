// client/components/layout/Navbar.jsx
'use client';
import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const Navbar = () => {
  return (
    <nav dir="rtl" className="w-full bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Logo MADAURE (Lien vers la page d'accueil) */}
        <Link href="/" className="flex items-center space-x-2 space-x-reverse">
          {/*  */}
          <span className="text-2xl font-black text-madaure-primary">مادور</span>
        </Link>
        
        {/* Liens de Navigation (Publics) */}
        <div className="hidden md:flex items-center space-x-6 space-x-reverse text-gray-700 font-medium">
          <Link href="#features" className="hover:text-madaure-primary transition">الميزات</Link>
          <Link href="#pricing" className="hover:text-madaure-primary transition">الأسعار</Link>
          <Link href="/dashboard/faq" className="hover:text-madaure-primary transition">الأسئلة الشائعة</Link>
        </div>
        
        {/* Boutons d'Action */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <Link href="/login">
            <Button variant="outline">
              تسجيل الدخول
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">
              إبدأ مجاناً
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;