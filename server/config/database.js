// server/config/database.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // --- C'EST LA LIGNE CLÉ À VÉRIFIER ---
        // Les options obsolètes (useNewUrlParser, useUnifiedTopology) sont supprimées.
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;