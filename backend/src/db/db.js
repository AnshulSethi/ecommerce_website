// const mongoose = require("mongoose");
// require("dotenv").config();

// const connect = async () => {
//     try {
//         const mongoURI = process.env.MONGODB_URI;
        
//         await mongoose.connect(mongoURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
        
//         console.log(" Database connected successfully to VIPS");
        
//         const db = mongoose.connection;
//         db.on('error', (error) => {
//             console.error('MongoDB connection error:', error);
//         });
        
//         db.on('disconnected', () => {
//             console.log('MongoDB disconnected');
//         });
        
//     } catch (err) {
//         console.error("Database connection failed:", err.message);
//         process.exit(1);
//     }
// };

// module.exports = connect;

// const mongoose = require("mongoose");
// require("dotenv").config();

// const connect = async () => {
//     try {
//         const mongoURI = process.env.MONGODB_URI;
//         if (!mongoURI) {
//             console.error("MONGODB_URI is not set in .env");
//             return;
//         }

//         console.log("Connecting to MongoDB...");
//         await mongoose.connect(mongoURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log("✅ Database connected successfully to VIPS");

//         mongoose.connection.on('error', (error) => {
//             console.error('MongoDB connection error:', error);
//         });

//         mongoose.connection.on('disconnected', () => {
//             console.log(' MongoDB disconnected');
//         });

//     } catch (err) {
//         console.error("Database connection failed:", err.message);
//     }
// };

// module.exports = connect;

//new pDb connection
const mongoose = require("mongoose");
require("dotenv").config();

const connect = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error("MONGODB_URI is not set in .env");
            return;
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 20,
            minPoolSize: 5,
            maxIdleTimeMS: 30000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log("✅ Database connected successfully to VIPS");

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
};

module.exports = connect;



// const mongoose = require("mongoose")

// const connect = ()=>{
//     mongoose.connect(process.env.MONGODB_URI)
//     .then(()=>{
//         console.log("database connected");
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// }

// module.exports = connect