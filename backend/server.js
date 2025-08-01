const app = require("./src/app");
const connect = require("./src/db/db");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connect(); 
        app.listen(PORT, () => {
            console.log("Server running on port:", PORT);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
};

startServer();
