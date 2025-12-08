// server/index.js - VERSION CORRIGÉE
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

// Connecter à la base de données
connectDB();

const app = express();

// ==========================================================
// CONFIGURATION MIDDLEWARE
// ==========================================================
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true,
}));

app.use(express.json());

// ==========================================================
// ROUTES TEMPORAIRES POUR TESTER L'AUTHENTIFICATION
// ==========================================================
// AJOUTEZ CES ROUTES ICI, APRÈS LA DÉFINITION DE 'app'
// Elles permettront de mapper /api/auth/* vers /api/users/*

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('📨 /api/auth/login appelé, redirection vers userController.loginUser');
    const userController = require('./controllers/userController');
    return userController.loginUser(req, res);
  } catch (error) {
    console.error('❌ Erreur /api/auth/login:', error);
    res.status(500).json({ message: 'Erreur serveur dans /auth/login' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📨 /api/auth/register appelé, redirection vers userController.registerUser');
    const userController = require('./controllers/userController');
    return userController.registerUser(req, res);
  } catch (error) {
    console.error('❌ Erreur /api/auth/register:', error);
    res.status(500).json({ message: 'Erreur serveur dans /auth/register' });
  }
});

// ==========================================================
// IMPORTATION DE TOUTES LES ROUTES
// ==========================================================
const userRoutes = require('./routes/users');
const lessonRoutes = require('./routes/lessons');
const summaryRoutes = require('./routes/summaries');
const subscriptionRoutes = require('./routes/subscriptions');
const notificationRoutes = require('./routes/notifications');
const supportRoutes = require('./routes/support');
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const activityRoutes = require('./routes/activities');

// ==========================================================
// DÉFINITION DE TOUTES LES ROUTES (Base URL: /api)
// ==========================================================
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activities', activityRoutes);

// Route de test simple
app.get('/', (req, res) => {
    res.send('✅ API MADAURE Running... Utilisez /api/auth/login ou /api/users/login');
});

app.get('/test-auth', (req, res) => {
  res.json({ 
    message: 'Test route works!',
    availableRoutes: [
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/users/login',
      'POST /api/users/register'
    ]
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3001;  // Assurez-vous que c'est le port 3001

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔑 Routes d'authentification disponibles:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/users/login`);
  console.log(`   POST http://localhost:${PORT}/api/users/register`);
  console.log(`\n👑 Pour tester l'admin:`);
  console.log(`   Email: admin@madaure.com`);
  console.log(`   Mot de passe: password123`);
});