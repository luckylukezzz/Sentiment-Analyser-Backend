// server.js
const { app, createMySQLPool } = require('./app');
const connectDB = require("./db/connect");

const port = process.env.SERVER_PORT || 5000;

const start = async () => {
    try {
        await createMySQLPool(); // Initialize MySQL pool
        await connectDB(process.env.MONGO_URI); // Connect to MongoDB
        console.log("Connected to MongoDBs");
        
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
        
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
};

start();
