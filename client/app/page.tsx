import React from 'react';
// Remplacement de toutes les dépendances non résolues par des icônes Lucide disponibles
import { BookOpen, Video, Users, CheckCircle, LogIn, UserPlus, Target, Star, ChevronLeft } from 'lucide-react';

// ===========================================
// CONFIGURATION DE COULEUR
// ===========================================
const primaryColor = 'bg-red-600';
const primaryTextColor = 'text-red-600';

// ===========================================
// COMPOSANT 1: Button (Simulé pour être auto-suffisant)
// ===========================================
const Button = ({ children, size, variant, className = '', ...props }) => {
  const baseStyle = "font-bold rounded-full transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]";
  
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  
  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-xl",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-md",
  };
  
  return (
    <button
      className={`${baseStyle} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ===========================================
// COMPOSANT 2: Navbar (Simulé pour être auto-suffisant)
// ===========================================
const Navbar = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo */}
                <a href="/">
                    <h1 className={`text-3xl font-extrabold ${primaryTextColor} tracking-wider`}>
                        مادور <span className="text-gray-800">للبكالوريا</span>
                    </h1>
                </a>

                {/* Liens de Navigation */}
                <nav className="space-x-6 space-x-reverse hidden md:flex text-gray-700 font-medium">
                    <a href="/#features" className="hover:text-red-600 transition">الميزات</a>
                    <a href="/#pricing" className="hover:text-red-600 transition">خطط الإشتراك</a>
                    <a href="/faq" className="hover:text-red-600 transition">الأسئلة الشائعة</a>
                </nav>

                {/* Boutons d'Action */}
                <div className="flex items-center space-x-4 space-x-reverse">
                    <a href="/login">
                        <Button size="md" variant="secondary" className="border border-gray-300 flex items-center gap-2">
                            <LogIn className="text-xl h-5 w-5" />
                            تسجيل الدخول
                        </Button>
                    </a>
                    <a href="/register">
                        <Button size="md" variant="primary" className="flex items-center gap-2">
                            <UserPlus className="text-xl h-5 w-5" />
                            سجل الآن
                        </Button>
                    </a>
                </div>
            </div>
        </header>
    );
};

// ===========================================
// COMPOSANT 3: Footer (Simulé pour être auto-suffisant)
// ===========================================
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-lg font-bold mb-4">مادور</p>
                <div className="flex justify-center space-x-6 space-x-reverse text-sm text-gray-400 mb-6">
                    <a href="/privacy" className="hover:text-red-400 transition">سياسة الخصوصية</a>
                    <a href="/terms" className="hover:text-red-400 transition">شروط الاستخدام</a>
                    <a href="/contact" className="hover:text-red-400 transition">اتصل بنا</a>
                </div>
                <p className="text-sm text-gray-500">
                    &copy; 2026 مادور. جميع الحقوق محفوظة.
                </p>
            </div>
        </footer>
    );
};

// ===========================================
// COMPOSANT 4: FeatureCard (Style moderne)
// ===========================================
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 h-full">
    <div className={`text-4xl ${primaryTextColor} mb-4 flex justify-center w-full`}>{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// ===========================================
// COMPOSANT 5: TestimonialCard (Nouveau)
// ===========================================
const TestimonialCard = ({ quote, name, role }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-600 flex flex-col h-full">
    <Star className="text-yellow-500 text-2xl mb-3" />
    <p className="italic text-gray-700 mb-4 flex-1">"{quote}"</p>
    <div className="border-t pt-3">
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

// ===========================================
// COMPOSANT PRINCIPAL: HomePage
// ===========================================

const HomePage = () => {
  // Fonctionnalités principales (Basé sur l'ancienne page mais avec plus de détails)
  const features = [
    { 
      icon: <Video />, 
      title: 'دروس مباشرة متواصلة', 
      description: 'احضر الحصص التفاعلية في الوقت الحقيقي مع أساتذة متخصصين لضمان الفهم الشامل.' 
    },
    { 
      icon: <BookOpen />, 
      title: 'ملخصات شاملة قابلة للتحميل', 
      description: 'الوصول إلى مكتبة ضخمة من الملخصات والوثائق الداعمة لجميع المواد الدراسية.' 
    },
    { 
      icon: <Users />, 
      title: 'تواصل مباشر مع الأساتذة', 
      description: 'اطرح أسئلتك واحصل على الإجابات في فضاء التواصل المخصص، مع دعم فوري.' 
    },
    { 
      icon: <Target />, 
      title: 'اختبارات وتقييم مستمر', 
      description: 'اختبارات دورية بعد كل وحدة لتقييم مستواك وتحديد نقاط الضعف بدقة.' 
    },
  ];
  
  // Témoignages (Ajoutés pour améliorer la preuve sociale)
  const testimonials = [
    {
      quote: 'هذه المنصة غيرت طريقة دراستي. بفضلها، أصبحت أستوعب المفاهيم الصعبة بكل سهولة ويسر.',
      name: 'محمد الأمين',
      role: 'طالب بكالوريا - علوم تجريبية',
    },
    {
      quote: 'جودة الدروس والملخصات تفوق التوقعات. النظام التعليمي المتكامل ساعد ابني على تحقيق نتائج ممتازة.',
      name: 'فاطمة الزهراء',
      role: 'ولية طالب',
    },
    {
      quote: 'الدعم المباشر من الأساتذة هو ما يميز هذه المنصة. لم أشعر أبداً بالعزلة أثناء التحضير للامتحان.',
      name: 'أحمد علي',
      role: 'طالب بكالوريا - شعبة رياضيات',
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        
        {/* Section 1: Héro (Bannière Principale) - Style 3asafeer */}
        <section className={`py-20 lg:py-32 ${primaryColor} text-white shadow-xl`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* Contenu Texte */}
            <div className="text-center lg:text-right">
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4">
                طريقك نحو النجاح في البكالوريا يبدأ من هنا
              </h1>
              <p className="text-xl lg:text-2xl font-light mb-8 opacity-90">
                منصة مادور تقدم لك دروسًا، ملخصات، واختبارات شاملة لتحقيق أفضل النتائج.
              </p>
              <a href="/register">
                <div className="inline-flex items-center gap-3 px-8 py-3 bg-white text-red-600 font-bold text-lg rounded-full shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                  إبدأ رحلة التفوق الآن
                  <ChevronLeft className="text-2xl h-6 w-6" />
                </div>
              </a>
            </div>
            
            {/* Illustration (Placeholder) */}
            <div className="hidden lg:flex justify-center">
              <div className="w-96 h-96 bg-red-700/50 rounded-full flex items-center justify-center shadow-2xl">
                <BookOpen className="text-8xl text-white opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: الميزات (Features) - Style 3asafeer Cards */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-12">لماذا تختار مادور؟</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: الأسعار (Pricing) - Style moderne */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
             <h2 className={`text-4xl font-extrabold text-gray-800 mb-12 ${primaryTextColor}`}>خطط الإشتراك</h2>
             <div className="p-10 bg-gray-50 rounded-2xl shadow-2xl border-t-8 border-red-600">
                <h3 className="text-3xl font-extrabold mb-3 text-gray-900">الباقة الذهبية</h3>
                <p className="text-6xl font-extrabold text-red-600">
                    3500 <span className="text-2xl font-medium">د.ج / لسنة</span>
                </p>
                <p className="text-gray-500 mt-2">السعر الأفضل للوصول الشامل</p>
                
                <ul className="mt-8 space-y-4 text-gray-700 text-lg">
                    <li className="flex items-center justify-center gap-3">
                        <CheckCircle className="text-green-500 h-6 w-6" /> 
                        وصول غير محدود لجميع الدروس (مسجلة ومباشرة)
                    </li>
                    <li className="flex items-center justify-center gap-3">
                        <CheckCircle className="text-green-500 h-6 w-6" /> 
                        جميع الملخصات والوثائق القابلة للتحميل
                    </li>
                    <li className="flex items-center justify-center gap-3">
                        <CheckCircle className="text-green-500 h-6 w-6" /> 
                        تواصل ودعم تقني وأكاديمي متميز
                    </li>
                </ul>
                <div className="mt-10">
                    <a href="/register">
                      <Button size="lg" variant="primary" className="w-full text-xl py-4 shadow-red-500/50">
                        اشترك الآن وابدأ فوراً
                      </Button>
                    </a>
                </div>
             </div>
          </div>
        </section>
        
        {/* Section 4: Témoignages (Ajoutée pour plus de crédibilité) */}
        <section className="py-20 bg-gray-100">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl font-extrabold text-center mb-12 ${primaryTextColor}`}>
              ماذا يقول الطلاب وأولياء الأمور؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      </main>
      
      <Footer />
    </div>
  );
};


export default HomePage;