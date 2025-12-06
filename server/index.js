// server/index.js

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
// CORRECTION DE CORS : Autoriser les origines du Frontend Next.js
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    credentials: true,
})); 

// Middleware intégré pour accepter le JSON dans le corps des requêtes
app.use(express.json()); 

// ==========================================================
// IMPORTATION DE TOUTES LES ROUTES
// ==========================================================
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const summaryRoutes = require('./routes/summaries');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const notificationRoutes = require('./routes/notifications');
const supportRoutes = require('./routes/support'); 
// La route FAQ est maintenant gérée par supportRoutes
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search'); 
const adminRoutes = require('./routes/admin'); // Importation de la route Admin

// ==========================================================
// DÉFINITION DE TOUTES LES ROUTES (Base URL: /api)
// ==========================================================
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes); // Gère les tickets et la FAQ
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes); 
app.use('/api/admin', adminRoutes); // Route pour les statistiques et outils Admin
app.use('/api/users', userRoutes);
app.use('/api/teachers', userRoutes); 

// Route de test simple
app.get('/', (req, res) => {
    res.send('API MADAURE Running...');
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));