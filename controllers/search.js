// search.js
const searchProducts = async (req, res) => {
    let searchTerm = req.query.term || '';
    searchTerm = searchTerm.trim();

    try {
        const pool = req.mysqlPool; // Get the connection pool from the request
        let query;
        let params = [];

        if (searchTerm) {
            query = `SELECT * FROM products WHERE title LIKE ? LIMIT 10`;
            params = [`%${searchTerm}%`];
        } else {
            query = `SELECT * FROM products LIMIT 10`;
        }

        // Query the database
        const [results] = await pool.execute(query, params);

        return res.json(results);
    } catch (error) {
        console.error('Error during search query:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { searchProducts };
