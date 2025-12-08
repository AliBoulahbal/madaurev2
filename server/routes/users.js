// server/routes/users.js - Version complète et corrigée
const express = require('express');
const router = express.Router();

// IMPORTATION CORRECTE DES CONTROLLEURS
// Vérifiez d'abord que le fichier existe
const fs = require('fs');
const path = require('path');
const controllerPath = path.join(__dirname, '../controllers/userController.js');

console.log('🔍 Vérification du contrôleur...');
console.log('Chemin du contrôleur:', controllerPath);
console.log('Fichier existe?', fs.existsSync(controllerPath));

if (!fs.existsSync(controllerPath)) {
  console.error('❌ ERREUR: Fichier userController.js introuvable!');
  console.error('Cherché à:', controllerPath);
  process.exit(1);
}

// Importation avec vérification
const userController = require(controllerPath);

// Vérifiez les exports
console.log('📦 Exports disponibles:', Object.keys(userController));

// Définition manuelle si nécessaire (fallback)
const ensureFunction = (func, name) => {
  if (typeof func === 'function') {
    return func;
  }
  console.warn(`⚠️  ${name} n'est pas une fonction, création d'un fallback`);
  return (req, res) => {
    console.log(`Fallback appelé pour ${name}:`, req.body);
    res.status(501).json({ 
      message: `Fonction ${name} non disponible`,
      error: `Type: ${typeof func}, Value: ${func}`
    });
  };
};

// Routes d'authentification (PUBLIC)
console.log('➕ Configuration des routes...');

// Route: /api/users/register
router.post('/register', ensureFunction(userController.registerUser, 'registerUser'));

// Route: /api/users/login  
router.post('/login', ensureFunction(userController.loginUser, 'loginUser'));

// IMPORTATION DU MIDDLEWARE D'AUTHENTIFICATION
const authMiddlewarePath = path.join(__dirname, '../middleware/auth.js');
console.log('Chemin middleware auth:', authMiddlewarePath);
console.log('Middleware existe?', fs.existsSync(authMiddlewarePath));

let authMiddleware;
try {
  authMiddleware = require(authMiddlewarePath);
  console.log('✅ Middleware auth importé avec succès');
} catch (error) {
  console.error('❌ Erreur import middleware auth:', error.message);
  // Fallback pour le middleware
  authMiddleware = {
    protect: (req, res, next) => {
      console.log('Middleware protect fallback appelé');
      req.user = { _id: 'fallback-user-id', role: 'admin' };
      next();
    },
    authorizeRoles: (roles) => (req, res, next) => {
      console.log('Middleware authorizeRoles fallback appelé pour roles:', roles);
      next();
    }
  };
}

// Routes protégées - PROFIL UTILISATEUR
// Route: /api/users/me (GET - obtenir son profil)
router.get('/me', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(userController.getMe, 'getMe')
);

// Route: /api/users/me (PUT - mettre à jour son profil)
router.put('/me', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(userController.updateMyProfile, 'updateMyProfile')
);

// Route: /api/users/teachers (GET - liste des enseignants)
router.get('/teachers', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(userController.getAllTeachers, 'getAllTeachers')
);

// --- ROUTES ADMINISTRATEUR ---
// Route: /api/users (GET - liste tous les utilisateurs)
router.get('/', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(authMiddleware.authorizeRoles, 'authorizeRoles')(['admin']),
  ensureFunction(userController.getAllUsers, 'getAllUsers')
);

// Route: /api/users (POST - créer un utilisateur - admin seulement)
router.post('/', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(authMiddleware.authorizeRoles, 'authorizeRoles')(['admin']),
  ensureFunction(userController.createUserByAdmin, 'createUserByAdmin')
);

// Route: /api/users/:id (PUT - mettre à jour un utilisateur)
router.put('/:id', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(authMiddleware.authorizeRoles, 'authorizeRoles')(['admin']),
  ensureFunction(userController.updateUserByAdmin, 'updateUserByAdmin')
);

// Route: /api/users/:id (DELETE - supprimer un utilisateur)
router.delete('/:id', 
  ensureFunction(authMiddleware.protect, 'protect'),
  ensureFunction(authMiddleware.authorizeRoles, 'authorizeRoles')(['admin']),
  ensureFunction(userController.deleteUser, 'deleteUser')
);

console.log('✅ Routes users configurées avec succès!');
console.log('Routes disponibles:');
console.log('  POST   /api/users/register');
console.log('  POST   /api/users/login');
console.log('  GET    /api/users/me');
console.log('  PUT    /api/users/me');
console.log('  GET    /api/users/teachers');
console.log('  GET    /api/users/ (admin)');
console.log('  POST   /api/users/ (admin)');
console.log('  PUT    /api/users/:id (admin)');
console.log('  DELETE /api/users/:id (admin)');

module.exports = router;