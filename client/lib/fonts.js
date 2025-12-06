import localFont from 'next/font/local'; 
import { Inter } from 'next/font/google';

// Définition de la police locale Hacen Algeria Hd
// CORRECTION CLÉ : Utiliser le nom exact du fichier avec les tirets
export const hacen_algeria_hd = localFont({ 
    src: [
        {
            path: '../public/fonts/Hacen-Algeria-Hd.ttf', // <-- NOM DE FICHIER CORRIGÉ (Ajout des tirets)
            weight: '400', 
            style: 'normal'
        },
    ],
    variable: '--font-hacen', // Nom CSS pour l'utiliser dans Tailwind
    display: 'swap',
});

// Ancien font principal (si vous voulez le garder)
export const tajawal = localFont({ 
    src: [
        {
            path: '../public/fonts/Tajawal-Regular.ttf', // <-- Assurer la cohérence du chemin
            weight: '400', 
            style: 'normal'
        },
    ],
    variable: '--font-tajawal',
    display: 'swap',
});

// Police par défaut pour les éléments de l'interface non-arabes (si nécessaire)
export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});