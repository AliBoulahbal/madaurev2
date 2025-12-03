// client/lib/fonts.js
import { Tajawal } from 'next/font/google';

/**
 * Configure la police Tajawal avec les sous-ensembles nécessaires (latin et arabe).
 * Next.js gère automatiquement l'optimisation, l'auto-hébergement et le FOUT.
 */
export const tajawal = Tajawal({
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal', // Nom de la variable CSS pour Tailwind
  display: 'swap',
});