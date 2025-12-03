// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ASSUREZ-VOUS QUE CE CHEMIN EST CORRECT POUR VOTRE STRUCTURE
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'madaure-primary': '#c02432', // Votre couleur MADAURE
        'madaure-dark': '#9b1d28', 
        'madaure-light': '#d44955',
      },
      fontFamily: {
        // ESSENTIEL pour la police Tajawal
        sans: ['var(--font-tajawal)', 'sans-serif'], 
      },
    },
  },
  plugins: [],
};