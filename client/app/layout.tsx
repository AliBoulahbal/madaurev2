// client/app/layout.jsx
import './globals.css';
import { tajawal } from '@/lib/fonts'; // Importation de la police Tajawal
import { AuthProvider } from '@/contexts/AuthContext'; // Importation du fournisseur d'authentification
import { NotificationProvider } from '@/contexts/NotificationContext'; // Importation du fournisseur de notifications

/**
 * Métadonnées de l'application MADAURE
 * (Ces informations aident au SEO et à l'affichage du site)
 */
export const metadata = {
  title: {
    default: 'MADAURE - منصة التعليم الذكي للثالثة ثانوي',
    template: '%s | MADAURE'
  },
  description: 'منصة تعليمية للمراجعة والدروس المباشرة والتفوق في شهادة البكالوريا.',
  keywords: ['بكالوريا', 'ثالثة ثانوي', 'دروس مباشرة', 'ملخصات', 'تعليم الجزائر'],
  authors: [{ name: 'MADAURE Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

/**
 * Composant RootLayout (Layout racine)
 * * Il encapsule toute l'application avec les fournisseurs de contexte
 * et configure le HTML global pour le RTL et la police.
 */
export default function RootLayout({ children }) {
  return (
    // 1. Configuration HTML pour la langue (ar) et la direction (rtl)
    // 2. Application de la police Tajawal via ses variables CSS
    <html lang="ar" dir="rtl" className={`${tajawal.className} ${tajawal.variable}`}>
      <body>
        {/* Fournisseurs de Contexte :
          Ils rendent l'état global (utilisateur, notifications) accessible à tous les composants.
        */}
        <AuthProvider>
          <NotificationProvider> 
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}