
const getImprovementTips = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for improvement:", asin);

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    // Query the database to get improvements for the given ASIN
    const pool = req.mysqlPool;

    const [rows] = await pool.query(
      'SELECT improvements FROM products WHERE parent_asin = ?', 
      [asin]
    );

    // Check if the product exists and has improvements
    if (rows.length > 0 && rows[0].improvements) {
      let improvementTips;

      // Try parsing the improvements column
      try {
        improvementTips = JSON.parse(rows[0].improvements); // Assuming improvements is stored as a JSON string
      } catch (parseError) {
        console.error("Error parsing improvements JSON:", parseError);
        return res.status(500).json({ error: "Error parsing improvements data" });
      }

      console.log("Sent response for ASIN:", asin);
      return res.status(200).json(improvementTips); // Return the list of improvement tips
    } else {
      return res.status(404).json({ error: "No improvements found for the given ASIN" });
    }
  } catch (err) {
    console.error("Error fetching improvements:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getImprovementTips };
