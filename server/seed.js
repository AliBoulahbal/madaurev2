const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); 

// Importation des Modèles
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const UserActivity = require('./models/UserActivity');
const Communication = require('./models/Communication');
const Notification = require('./models/Notification');
const Summary = require('./models/Summary');
const Token = require('./models/Token'); 

// Charger les variables d'environnement
dotenv.config({ path: './.env' });

// ==========================================================
// FONCTION DE CONNEXION DB
// ==========================================================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding.');
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    }
};


// ==========================================================
// DONNÉES FICTIVES
// ==========================================================

// Mot de passe par défaut pour tous les utilisateurs : 'password123'
const defaultPassword = 'password123'; 
const defaultBranch = 'Science'; 

const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
const pastDate = new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)); 

// 1. UTILISATEURS (8) - Ajout de l'Admin et de Teachers/Students supplémentaires
const usersData = [
    // --- ADMIN ---
    { name: 'Super Admin', email: 'admin@madaure.com', password: defaultPassword, role: 'admin', branch: 'General' },
    
    // --- TEACHERS ---
    { name: 'Pr. Ahmed (Physique)', email: 'ahmed@teacher.com', password: defaultPassword, role: 'teacher', branch: defaultBranch },
    { name: 'Pr. Fatma (Histoire)', email: 'fatma@teacher.com', password: defaultPassword, role: 'teacher', branch: 'Literature' },
    { name: 'Pr. Karim (Maths)', email: 'karim@teacher.com', password: defaultPassword, role: 'teacher', branch: defaultBranch }, // Nouveau Teacher
    
    // --- STUDENTS ---
    { name: 'Ali B', email: 'ali@test.com', password: defaultPassword, role: 'student', branch: defaultBranch },
    { name: 'Sara Kh.', email: 'sara@test.com', password: defaultPassword, role: 'student', branch: defaultBranch },
    { name: 'Amine Z.', email: 'amine@test.com', password: defaultPassword, role: 'student', branch: defaultBranch },
    { name: 'Nour M.', email: 'nour@test.com', password: defaultPassword, role: 'student', branch: 'Literature' }, // Nouveau Student
];

// 2. RÉSUMÉS (6)
const summariesData = [
    { title: 'ملخص الحركة في بعدين', subject: 'الفيزياء', fileUrl: 'http://example.com/summary/physic1.pdf' },
    { title: 'الجداء السلمي والمتجهات', subject: 'الرياضيات', fileUrl: 'http://example.com/summary/math2.pdf' },
    { title: 'ملخص تاريخي: الثورة الجزائرية', subject: 'التاريخ', fileUrl: 'http://example.com/summary/history.pdf' },
    { title: 'ملخص شامل للأحماض والقواعد', subject: 'الكيمياء', fileUrl: 'http://example.com/summary/chem.pdf' },
    { title: 'أساسيات الفلسفة الحديثة', subject: 'الفلسفة', fileUrl: 'http://example.com/summary/philosophy.pdf' },
    { title: 'ملخص البكالوريا للغة العربية', subject: 'اللغة العربية', fileUrl: 'http://example.com/summary/arabic.pdf' },
];

// 3. TOKENS (4)
const tokensData = [
    { tokenCode: '20252026', isConsumed: false, contractExpirationDate: futureDate },
    { tokenCode: '30304040', isConsumed: false, contractExpirationDate: futureDate },
    { tokenCode: '11112222', isConsumed: false, contractExpirationDate: pastDate },
    { tokenCode: '99990000', isConsumed: true, contractExpirationDate: futureDate },
];


// ==========================================================
// FONCTIONS D'IMPORTATION ET DE DESTRUCTION
// ==========================================================

const importData = async () => {
    await connectDB();

    try {
        // 1. Suppression des données existantes (Nettoyage)
        await UserActivity.deleteMany();
        await Communication.deleteMany();
        await Notification.deleteMany();
        await Lesson.deleteMany();
        await User.deleteMany();
        await Summary.deleteMany();
        await Token.deleteMany(); 
        console.log('🗑️ Old data destroyed.');

        // 2. Hacher les mots de passe et insérer les Utilisateurs
        const hashPromises = usersData.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        });

        const usersWithHashedPasswords = await Promise.all(hashPromises);
        
        const createdUsers = await User.insertMany(usersWithHashedPasswords);
        
        // ATTRIBUTION DES VARIABLES APRES INSERTION
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const ahmed = createdUsers.find(u => u.email === 'ahmed@teacher.com'); // Teacher (Physics)
        const fatma = createdUsers.find(u => u.email === 'fatma@teacher.com'); // Teacher (Literature/History)
        const karim = createdUsers.find(u => u.email === 'karim@teacher.com'); // Teacher (Maths)
        const ali = createdUsers.find(u => u.email === 'ali@test.com'); // Student (Stats target)
        const sara = createdUsers.find(u => u.email === 'sara@test.com'); // Student
        
        console.log(`👤 Users created: ${createdUsers.length}`);
        
        // 3. Insertion des Tokens
        const consumedToken = tokensData.find(t => t.tokenCode === '99990000');
        if (consumedToken) {
            // Assigner le token consommé à l'étudiant "ali"
            consumedToken.assignedToUser = ali._id; 
        }
        await Token.insertMany(tokensData);
        console.log(`🔑 Tokens created: ${tokensData.length}`);

        // 4. Insertion des Résumés
        const createdSummaries = await Summary.insertMany(summariesData.map(s => {
            let teacherId;
            if (s.subject === 'الفلسفة' || s.subject === 'التاريخ' || s.subject === 'اللغة العربية') {
                teacherId = fatma._id;
            } else if (s.subject === 'الرياضيات') {
                teacherId = karim._id;
            } else {
                teacherId = ahmed._id;
            }
            return { ...s, teacher: teacherId };
        }));
        
        const summary_chem = createdSummaries.find(s => s.subject === 'الكيمياء');
        const summary_math = createdSummaries.find(s => s.subject === 'الرياضيات');
        const summary_hist = createdSummaries.find(s => s.subject === 'التاريخ');
        const summary_arabic = createdSummaries.find(s => s.subject === 'اللغة العربية');
        console.log(`📚 Summaries created: ${createdSummaries.length}`);

        // 5. Insertion des Leçons (10 leçons)
        const lessonsToInsert = [
            // Leçon 1 (Physique - Live)
            { title: 'مراجعة شاملة للكهرباء', description: 'وحدة التيار المستمر والمكثفات.', subject: 'الفيزياء', teacher: ahmed._id, startTime: new Date(Date.now() + 86400000), duration: 90, isLive: true, content: [{ type: 'video', order: 1, title: 'المقدمة', data: { url: 'https://www.youtube.com/embed/demo' } }] },
            // Leçon 2 (Maths - Quiz)
            { title: 'تطبيقات على الدوال الأسية', description: 'حلول المعادلات والمتباينات.', subject: 'الرياضيات', teacher: karim._id, startTime: new Date(Date.now() + 172800000), duration: 120, isLive: false, content: [{ type: 'quiz', order: 1, title: 'اختبار سريع', data: { questions: [{ questionText: 'مشتق دالة (e^x) هو؟', options: [{ text: '1', isCorrect: false }, { text: 'e^x', isCorrect: true }] }] } }, { type: 'summary-ref', order: 2, title: 'ملخص', data: { summaryId: summary_math._id } }] },
            // Leçon 3 (Histoire - Texte)
            { title: 'الحرب الباردة: الأسباب والنتائج', description: 'تحليل وثائقي حول الصراع.', subject: 'التاريخ والجغرافيا', teacher: fatma._id, startTime: new Date(Date.now() + 604800000), duration: 60, isLive: false, content: [{ type: 'text', order: 1, title: 'مقدمة تاريخية', data: { body: '<h3>مقدمة تاريخية</h3><p>بدأت الحرب الباردة بعد نهاية الحرب العالمية الثانية...</p>' } }, { type: 'summary-ref', order: 2, title: 'مخطط زمني', data: { summaryId: summary_hist._id } }] },
            // Leçon 4 (Chimie - Vidéo Courte)
            { title: 'الأحماض والقواعد القوية', description: 'شرح تفاعلات التعادل في المحاليل المائية.', subject: 'الكيمياء', teacher: ahmed._id, startTime: new Date(Date.now() + 10 * 86400000), duration: 45, isLive: false, content: [{ type: 'video', order: 1, title: 'الفيديو الرئيسي', data: { url: 'https://www.youtube.com/embed/demo_chem' } }, { type: 'summary-ref', order: 2, title: 'ملخص', data: { summaryId: summary_chem._id } }] },
            // Leçon 5 (فلسفة - Texte)
            { title: 'مقارنة بين المذهب العقلي والتجريبي', description: 'تحليل للنصوص الفلسفية الأساسية.', subject: 'الفلسفة', teacher: fatma._id, startTime: new Date(Date.now() + 15 * 86400000), duration: 120, isLive: false, content: [{ type: 'text', order: 1, title: 'المقارنة الأساسية', data: { body: '<p>يختلف المذهب العقلي عن التجريبي في مصدر المعرفة...</p>' } }] },
            // Leçon 6 (Physique - Live Annulée)
            { title: 'الموجات فوق الصوتية', description: 'تأثير دوبلر في الموجات.', subject: 'الفيزياء', teacher: ahmed._id, startTime: new Date(Date.now() + 3 * 86400000), duration: 60, isLive: false, status: 'cancelled', content: [] },
            // Leçon 7 (Maths - Complétée)
            { title: 'نهايات الدوال اللوغاريتمية', description: 'تطبيق قاعدة لوبيتال.', subject: 'الرياضيات', teacher: karim._id, startTime: new Date(Date.now() - 5 * 86400000), duration: 90, isLive: false, status: 'completed', content: [{ type: 'video', order: 1, title: 'الشرح الكامل', data: { url: 'https://www.youtube.com/embed/completed_math' } }] },
            // Leçon 8 (Histoire - En Cours)
            { title: 'القضية الفلسطينية', description: 'من وعد بلفور حتى الانتفاضة الثانية.', subject: 'التاريخ والجغرافيا', teacher: fatma._id, startTime: new Date(Date.now() + 5 * 86400000), duration: 75, isLive: true, content: [{ type: 'video', order: 1, title: 'الجزء الأول', data: { url: 'https://www.youtube.com/embed/palestine_part1' } }] },
            // Leçon 9 (Chimie - Quiz)
            { title: 'المعايرة والتركيز المولي', description: 'تمارين وحلول.', subject: 'الكيمياء', teacher: ahmed._id, startTime: new Date(Date.now() + 7 * 86400000), duration: 60, isLive: false, content: [{ type: 'quiz', order: 1, title: 'اختبار التركيز', data: { questions: [{ questionText: 'وحدة التركيز المولي؟', options: [{ text: 'g/L', isCorrect: false }, { text: 'mol/L', isCorrect: true }] }] } }] },
            // Leçon 10 (اللغة العربية)
            { title: 'المدارس الشعرية الحديثة', description: 'مدرسة الإحياء والبعث.', subject: 'اللغة العربية', teacher: fatma._id, startTime: new Date(Date.now() + 12 * 86400000), duration: 90, isLive: false, content: [{ type: 'summary-ref', order: 1, title: 'ملخص الدرس', data: { summaryId: summary_arabic._id } }] },
        ];
        
        const createdLessons = await Lesson.insertMany(lessonsToInsert);
        const lesson_completed = createdLessons.find(l => l.status === 'completed');
        const lesson_math_scheduled = createdLessons.find(l => l.subject === 'الرياضيات' && l.status === 'scheduled'); // Leçon 2
        
        console.log(`🎥 Lessons created: ${createdLessons.length}`);
        
        // 7. Insertion des Activités Utilisateur (pour des stats réelles pour Ali)
        await UserActivity.insertMany([
            // Leçons Complétées (Compteur lessonsCompleted = 1)
            { user: ali._id, activityType: 'lesson_complete', relatedId: lesson_completed._id },
            // Activité Quiz réussie
            { user: ali._id, activityType: 'quiz_pass', relatedId: lesson_math_scheduled._id, details: { score: 10, total: 10 } },
            // Téléchargements (Compteur totalDownloads = 4)
            { user: ali._id, activityType: 'summary_download', relatedId: summary_chem._id },
            { user: ali._id, activityType: 'summary_download', relatedId: summary_chem._id },
            { user: ali._id, activityType: 'summary_download', relatedId: summary_math._id },
            { user: ali._id, activityType: 'summary_download', relatedId: summary_hist._id },
        ]);
        console.log('📊 Activities seeded.');

        // 8. Insertion des Communications (Interactions = 2)
        await Communication.create({ sender: ali._id, recipient: ahmed._id, message: 'لدي سؤال حول الجزء الأول من الفيزياء.' });
        await Communication.create({ sender: sara._id, recipient: fatma._id, message: 'متى يبدأ درس التاريخ؟' });
        console.log('💬 Communication seeded.');
        
        // 9. Insertion de Notifications
        await Notification.create({ user: ali._id, message: 'بدأ درس الفيزياء الجديد!', isRead: false });
        await Notification.create({ user: sara._id, message: 'تم الرد على استفسارك.', isRead: false });
        console.log('🔔 Notifications seeded.');

        console.log(`✅ Data Imported Successfully! Utilisez admin@madaure.com / password123 (Rôle: Admin) pour vous connecter.`);
        process.exit();

    } catch (error) {
        console.error(`🚨 Fatal Error importing data: ${error.message}`);
        process.exit(1);
    }
};

importData();