// app.js
require("dotenv").config();
require('express-async-errors');

const connectDB = require("./db/connect");
const mysql = require('mysql2/promise');
const express = require("express");
const cors = require('cors');
const mainRouter = require("./routes/mainRouter");

const app = express();

// Middleware for JSON and CORS
app.use(express.json());
app.use(cors());

// Create MySQL connection pool
let mysqlPool;
const createMySQLPool = async () => {
    try {
        mysqlPool = await mysql.createPool({
            host: process.env.SQL_HOST,
            port: process.env.SQL_PORT,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            ssl: {
                rejectUnauthorized: false
            },
            connectionLimit: 10,
            connectTimeout: 10000 // 10 seconds
        });
        console.log("Connected to MySQL");
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        throw error; // Re-throw error to prevent app from starting
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

// Export the app and pool function for server and tests
module.exports = { app, createMySQLPool };
