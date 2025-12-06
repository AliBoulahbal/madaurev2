/** @type {import('eslint').Linter.Config} */
const config = {
  // L'environnement Next.js utilise le moteur de linting Next.js
  extends: 'next',
  
  // Configuration pour le linting des fichiers TypeScript
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['next/core-web-vitals', 'next/typescript'],
    },
  ],

  // Règles personnalisées ou désactivées
  rules: {
    // Par exemple, désactiver les warnings sur les liens sans <a> à l'intérieur de <Link>
    // '@next/next/no-html-link-for-pages': 'off', 
    
    // Ajoutez ici toute autre règle spécifique à votre équipe
  },
};

module.exports = config;