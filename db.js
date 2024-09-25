require('dotenv').config();

const mysql = require('mysql2/promise');

// Create a single connection (async)
const connectDB = async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,                  
        password: process.env.SQL_PASSWORD,          
        database: process. env.SQL_DATABASE,
        port: process.env.SQL_PORT,
      });
      console.log('Connected to the database');
      return connection;
    } catch (err) {
      console.error('Error connecting to the database:', err);
      throw err;  // Rethrow error to handle it higher up if necessary
    }
  };
  
  module.exports = connectDB;
