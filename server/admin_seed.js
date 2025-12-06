const mongoose = require('mongoose');
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); // Bibliothèque standard pour le hachage

// --- CONFIGURATION ---
// Remplacez par votre chaîne de connexion MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/madaure_db';

// NOTE IMPORTANTE: Changez le mot de passe avant d'utiliser en production
// Les mots de passe sont laissés en clair ici pour la démonstration du seeding.
const usersToSeed = [
    // 1. Administrateur Principal (Accès complet)
    { 
        name: 'Super Admin', 
        email: 'admin@madaure.com', 
        password: 'admin123', 
        role: 'admin', 
        branch: 'General' 
    },
    
    // 2. Enseignants (Accès au dashboard admin et gestion du contenu si autorisé)
    { 
        name: 'Professeur Science', 
        email: 'teacher.science@madaure.com', 
        password: 'teacher123', 
        role: 'teacher', 
        branch: 'Science' 
    },
    { 
        name: 'Professeur Maths', 
        email: 'teacher.maths@madaure.com', 
        password: 'teacher123', 
        role: 'teacher', 
        branch: 'Maths' 
    },
    
    // 3. Étudiants (Accès standard, rôles de base)
    { 
        name: 'Étudiant Avancé', 
        email: 'student.advanced@madaure.com', 
        password: 'student123', 
        role: 'student', 
        branch: 'Science' 
    },
    { 
        name: 'Étudiant Débutant', 
        email: 'student.junior@madaure.com', 
        password: 'student123', 
        role: 'student', 
        branch: 'Maths' 
    }
];
// ---

/**
 * Fonction pour connecter la base de données et créer les utilisateurs.
 */
const seedUsers = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('--- Connexion MongoDB établie pour le seeding ---');
        
        const salt = await bcrypt.genSalt(10);
        
        for (const userData of usersToSeed) {
            // 1. Vérifier si l'utilisateur existe déjà
            const userExists = await User.findOne({ email: userData.email });

            if (userExists) {
                console.log(`L'utilisateur (${userData.email}) existe déjà. Seeding ignoré.`);
                continue;
            }

            // 2. Hacher le mot de passe (Utilisation réelle de bcrypt)
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            // 3. Créer le nouvel utilisateur
            const newUser = new User({
                name: userData.name,
                email: userData.email,
                password: hashedPassword, 
                role: userData.role,
                branch: userData.branch
            });

            await newUser.save();
            
            console.log(`✅ Utilisateur ${userData.role} créé: ${userData.email}`);
        }

        console.log('\n🌟 Seeding complet : Tous les utilisateurs de test ont été créés.');

    } catch (error) {
        console.error('❌ Erreur lors du seeding des utilisateurs:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('--- Déconnexion MongoDB ---');
    }
};

seedUsers();