// server/src/index.js (FINALISATION DE L'IMPORTATION DES ROUTES)

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

// Connecter à la base de données
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Importation de TOUTES les routes
const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const summaryRoutes = require('./routes/summaries');
const userRoutes = require('./routes/users'); // Pour profile, teachers
const subscriptionRoutes = require('./routes/subscriptions');
const notificationRoutes = require('./routes/notifications');
const supportRoutes = require('./routes/support');
const faqRoutes = require('./routes/faq');

// Définition de TOUTES les routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/summaries', summaryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teachers', userRoutes); // Utilisation d'une route claire pour la page Professeurs

app.get('/', (req, res) => {
    res.send('API MADAURE Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));