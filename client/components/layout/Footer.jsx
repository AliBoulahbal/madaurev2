// client/components/layout/Footer.jsx
import React from 'react';
import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer dir="rtl" className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* 1. شعار ومعلومات الاتصال */}
          <div>
            <h3 className="text-xl font-bold text-madaure-light mb-4">مادور</h3>
            <p className="text-sm text-gray-400">منصة تعليمية ذكية للثالثة ثانوي.</p>
            <div className="mt-4 space-y-2 text-sm">
              <span className="flex items-center gap-2">
                <FiMail /> support@madaure.com
              </span>
              <span className="flex items-center gap-2">
                <FiPhone /> +213 5XX XXX XXX
              </span>
              <span className="flex items-center gap-2">
                <FiMapPin /> الجزائر العاصمة، الجزائر
              </span>
            </div>
          </div>

          {/* 2. الروابط السريعة */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard" className="hover:text-madaure-primary transition">لوحة التحكم</Link></li>
              <li><Link href="#features" className="hover:text-madaure-primary transition">الميزات</Link></li>
              <li><Link href="#pricing" className="hover:text-madaure-primary transition">الأسعار</Link></li>
            </ul>
          </div>

          {/* 3. الدعم والقانونية */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard/faq" className="hover:text-madaure-primary transition">الأسئلة الشائعة</Link></li>
              <li><Link href="/dashboard/support" className="hover:text-madaure-primary transition">تذاكر الدعم</Link></li>
              <li><Link href="#" className="hover:text-madaure-primary transition">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* 4. اشترك في النشرة */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">اشترك في النشرة الإخبارية</h4>
            <form className="flex">
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="w-full px-3 py-2 rounded-r-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-madaure-primary"
                dir="rtl"
              />
              <button 
                type="submit" 
                className="bg-madaure-primary hover:bg-red-700 text-white px-4 py-2 rounded-l-lg transition"
              >
                إرسال
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} مادور. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};

export default Footer;