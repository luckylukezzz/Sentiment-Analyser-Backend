require('dotenv').config();

const mysql = require('mysql2/promise');

// Create a single connection (async)
const connectDB = async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,                  
        password: process.env.PASSWORD,          
        database: process. env.DATABASE,
        port: process.env.PORT,
      });
      console.log('Connected to the database');
      return connection;
    } catch (err) {
      console.error('Error connecting to the database:', err);
      throw err;  // Rethrow error to handle it higher up if necessary
    }
  };
  
  module.exports = connectDB;
