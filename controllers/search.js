const mysql = require('mysql2');
require('dotenv').config(); 

const db = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: {
        rejectUnauthorized: false 
    }
});
// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Search products function
const searchProducts = (req, res) => {
    let searchTerm = req.query.term || '';
    searchTerm = searchTerm.trim();
    console.log(searchTerm); // Prepare for SQL LIKE search

    let query;
    if (searchTerm) {
        query = `SELECT * FROM products WHERE title LIKE ? LIMIT 10`;
        db.query(query, [`%${searchTerm}%`], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.json(results);
        });
    } else {
        query = `SELECT * FROM products LIMIT 10`;
        db.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.json(results);
        });
    }
};

module.exports = { searchProducts };
