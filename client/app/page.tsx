"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiBookOpen, 
  FiVideo, 
  FiUsers, 
  FiCheckCircle, 
  FiStar, 
  FiChevronLeft,
  FiHome,
  FiSettings,
  FiUser,
  FiFileText
} from 'react-icons/fi';

// Importez vos composants réels (si disponibles)
// import Navbar from '@/components/layout/Navbar';
// import Footer from '@/components/layout/Footer';
// import Button from '@/components/ui/Button';

// Composant Button de secours
const Button = ({ children, className = "", variant = 'primary', size = 'md', ...props }) => {
  const baseStyle = "px-6 py-3 font-semibold rounded-lg transition duration-300 shadow-lg";
  const variantStyle = variant === 'primary' 
    ? "bg-red-600 text-white hover:bg-red-700" 
    : variant === 'outline'
    ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
    : "";
  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// Composant Navbar de secours
const Navbar = () => (
  <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center" dir="rtl">
      <h1 className="text-red-600 text-3xl font-extrabold tracking-wider">
        <Link href="/">مادور</Link>
      </h1>
      <nav className="flex items-center space-x-4 space-x-reverse">
        <Link href="/dashboard" className="text-gray-600 hover:text-red-600 font-medium">
          الدروس
        </Link>
        <Link href="/pricing" className="text-gray-600 hover:text-red-600 font-medium">
          الإشتراكات
        </Link>
        <Link href="/login">
          <Button variant="outline" className="text-sm border-gray-400">
            تسجيل الدخول
          </Button>
        </Link>
        <Link href="/register">
          <Button className="text-sm">إبدأ الآن</Button>
        </Link>
      </nav>
    </div>
  </header>
);

// Composant Footer de secours
const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} مادور. جميع الحقوق محفوظة.
      </p>
    </div>
  </footer>
);

// Composant Helper FeatureCard
const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
    <div className="text-red-600 text-5xl mb-4 flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Composant Helper TestimonialCard
const TestimonialCard = ({ quote, name, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600 flex flex-col h-full">
    <FiStar className="text-yellow-500 text-2xl mb-3" />
    <p className="italic text-gray-700 mb-4 flex-1">"{quote}"</p>
    <div className="border-t pt-3">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

const HomePage = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    { 
      quote: 'بفضل منصة مادور، تمكنت من الحصول على علامات ممتازة في الرياضيات والفيزياء.', 
      name: 'سارة أ.', 
      role: 'طالبة بكالوريا، فرع العلوم' 
    },
    { 
      quote: 'الدروس المباشرة والمكثفة ساعدتني على استيعاب أصعب المفاهيم في وقت قياسي.', 
      name: 'كريم م.', 
      role: 'طالب بكالوريا، فرع الآداب' 
    },
  ];

  // Variables de couleur
  const primaryColor = 'bg-red-600';
  const secondaryColor = 'text-red-600';

  if (!mounted) {
    return null; // Évite les erreurs d'hydration
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Section 1: Héro (Bannière Principale) */}
        <section className={`${primaryColor} py-24 text-center text-white`}>
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              أفضل منصة للتحضير للثالثة ثانوي في الجزائر
            </h1>
            <p className="mt-6 text-xl opacity-90">
              انضم إلى <strong>مادور</strong> الآن واستفد من الدروس المباشرة، ملخصات شاملة، وتوجيهات الخبراء للنجاح في شهادة البكالوريا.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4 sm:space-x-reverse">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 transform hover:scale-105"
                >
                  إبدأ تجربتك المجانية
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  شاهد خطط الإشتراك
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: الميزات الرئيسية */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className={`${secondaryColor} text-3xl font-bold mb-4`}>
              لماذا تختار منصة مادور؟
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              نحن نضمن لك رحلة تعليمية منظمة وفعالة للوصول للتميز.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<FiVideo size={48} />} 
                title="حصص مباشرة وتفاعلية" 
                description="دروس مباشرة أسبوعية مع أساتذة متخصصين لضمان الفهم العميق وتغطية جميع الفصول."
              />
              <FeatureCard 
                icon={<FiBookOpen size={48} />} 
                title="ملخصات ووثائق شاملة" 
                description="احصل على ملفات PDF وملخصات منظمة ومصممة خصيصاً لمساعدتك في المراجعة النهائية."
              />
              <FeatureCard 
                icon={<FiUsers size={48} />} 
                title="دعم وتوجيه مستمر" 
                description="تواصل مباشر مع فريق الدعم والأساتذة للحصول على إجابات لجميع أسئلتك الأكاديمية."
              />
            </div>
          </div>
        </section>

        {/* Section 3: دعوة للعمل */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
              إشتراك واحد. وصول كامل.
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
              <p className="text-2xl font-bold text-gray-800 mb-4">
                إشتراك البكالوريا السنوي
              </p>
              <p className="text-6xl font-extrabold text-gray-900">
                3500 <span className="text-xl font-medium">د.ج / لسنة</span>
              </p>
              <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex items-center justify-center gap-2">
                  <FiCheckCircle className="text-green-500" /> 
                  وصول غير محدود لجميع الدروس
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FiCheckCircle className="text-green-500" /> 
                  جميع الملخصات والوثائق
                </li>
                <li className="flex items-center justify-center gap-2">
                  <FiCheckCircle className="text-green-500" /> 
                  دعم تقني متميز
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg" className="w-full">
                    اشترك الآن
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: آراء العملاء */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`${secondaryColor} text-3xl font-bold text-center mb-12`}>
              ماذا يقول طلابنا؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Section 5: CTA Finale */}
        <section className={`py-16 ${primaryColor}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              هل أنت مستعد لتحقيق حلم البكالوريا؟
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              انضم إلى آلاف الطلاب الذين وثقوا في منصة مادور وتميزوا في امتحاناتهم.
            </p>
            <Link href="/register">
              <Button className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-yellow-400 text-gray-900 font-bold text-lg hover:bg-yellow-300 transform hover:scale-105">
                سجل حسابك مجاناً
                <FiChevronLeft className="text-2xl" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;