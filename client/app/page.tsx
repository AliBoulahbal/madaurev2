// client/app/page.jsx
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { FiBookOpen, FiVideo, FiUsers, FiCheckCircle } from 'react-icons/fi';

const HomePage = () => {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        
        {/* Section 1: Héro (Bannière Principale) */}
        <section className="bg-gray-50 py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-snug">
              أفضل منصة للتحضير للثالثة ثانوي في الجزائر
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              انضم إلى **مادور** الآن واستفد من الدروس المباشرة، ملخصات شاملة، وتوجيهات الخبراء للنجاح في شهادة البكالوريا.
            </p>
            <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
              <Link href="/register">
                <Button size="lg" variant="primary">
                  إبدأ رحلتك التعليمية
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="secondary">
                  اكتشف المزيد
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: الميزات (Features) */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">لماذا تختار مادور؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FiVideo />} 
                title="دروس مباشرة متواصلة" 
                description="احضر الحصص التفاعلية في الوقت الحقيقي مع أساتذة متخصصين."
              />
              <FeatureCard 
                icon={<FiBookOpen />} 
                title="ملخصات شاملة قابلة للتحميل" 
                description="الوصول إلى مكتبة ضخمة من الملخصات لجميع المواد الدراسية."
              />
              <FeatureCard 
                icon={<FiUsers />} 
                title="تواصل مباشر مع الأساتذة" 
                description="اطرح أسئلتك واحصل على الإجابات في فضاء التواصل المخصص."
              />
            </div>
          </div>
        </section>

        {/* Section 3: الأسعار (Pricing - Utilisation de l'ID pour le lien de la Navbar) */}
        <section id="pricing" className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-gray-800 mb-10">خطط الإشتراك</h2>
             {/* Un composant Pricing simple pourrait être intégré ici */}
             <div className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-madaure-primary">
                <h3 className="text-2xl font-bold mb-2">الباقة الذهبية</h3>
                <p className="text-5xl font-extrabold text-gray-900">
                    99 <span className="text-xl font-medium">د.م / شهر</span>
                </p>
                <ul className="mt-6 space-y-3 text-gray-700">
                    <li className="flex items-center justify-center gap-2"><FiCheckCircle className="text-green-500" /> وصول غير محدود لجميع الدروس</li>
                    <li className="flex items-center justify-center gap-2"><FiCheckCircle className="text-green-500" /> جميع الملخصات والوثائق</li>
                    <li className="flex items-center justify-center gap-2"><FiCheckCircle className="text-green-500" /> دعم تقني متميز</li>
                </ul>
                <div className="mt-8">
                    <Link href="/register">
                      <Button size="lg" variant="primary" className="w-full">
                        اشترك الآن
                      </Button>
                    </Link>
                </div>
             </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

// Composant Helper
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300">
    <div className="text-5xl text-madaure-primary mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;