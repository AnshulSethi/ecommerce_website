const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/VIPS";
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("✅ Database connected successfully to VIPS");
        
        // Test the connection
        const db = mongoose.connection;
        db.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });
        
        db.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });
        
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connect;
