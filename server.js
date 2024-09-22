require("dotenv").config();
require('express-async-errors');

const connectDB = require("./db/connect"); // MongoDB connection
const mysql = require('mysql2/promise');   // MySQL connection
const express = require("express");
const cors = require('cors');
const app = express();
const mainRouter = require("./routes/mainRouter");

// Middleware for JSON and CORS
app.use(express.json());
app.use(cors());

// Create MySQL connection pool
let mysqlPool;
const createMySQLPool = async () => {
    try {
        mysqlPool = await mysql.createPool({
            host: process.env.HOST,
            port: process.env.PORT,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            ssl: {
                rejectUnauthorized: false
            },
            connectionLimit: 10, 
            connectTimeout: 10000 // 10 seconds
        });
        console.log("Connected to MySQL");
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        throw error; // Re-throw error to prevent server from starting
    }
};

// Middleware to attach MySQL pool to requests
app.use((req, res, next) => {
    if (!mysqlPool) {
        return res.status(500).json({ error: "MySQL pool is not available" });
    }
    req.mysqlPool = mysqlPool;
    next();
});


app.use("/api/v1", mainRouter);

const port = process.env.SERVER_PORT || 5000;


const start = async () => {
    try {
      
        await createMySQLPool(); 
        // Connect to MongoDB
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
}

start();
