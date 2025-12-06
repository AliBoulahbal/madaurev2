/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer le mode strict de React pour aider à détecter les problèmes potentiels
  reactStrictMode: true,
  
  // Configuration pour le composant <Image /> de Next.js (pour les vignettes YouTube, Vimeo et placeholders)
  images: {
    // Domaines autorisés pour les images externes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com', // <-- DOMAINE VIMEO AJOUTÉ
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Configuration essentielle pour le proxy (ajoutée)
  async rewrites() {
    return [
      {
        // Source: Toutes les requêtes commençant par /api (depuis le Frontend)
        source: '/api/:path*',
        // Destination: Redirige vers le Backend Express (port 5000 par défaut)
        destination: 'http://localhost:5000/api/:path*', 
      },
    ];
  },
};

module.exports = nextConfig;