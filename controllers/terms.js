// const getPosTerms = async (req, res) => {
//   const { asin } = req.query;
//   console.log("Received ASIN for post terms:", asin);

//   const positiveTerms = [
//     "Excellent",
//     "Outstanding product amazing Outstanding product amazing",
//     "Fantastic",
//     "Wonderful",
//     "Great",
//     "Amazing",
//     "Superb",
//     "Impressive",
//     "Marvelous",
//     "Exceptional",
//     "Excellent",
//     "Outstanding",
//     "Fantastic",
//     "Wonderful",
//     "Great",
//     "Amazing",
//     "Superb",
//     "Impressive",
//     "Marvelous",
//     "Exceptional",
//   ];

//   if (!asin) {
//     return res.status(400).json({ error: "ASIN is required" });
//   }
//   console.log("sent resp for ASIN:", asin);
//   return res.status(200).json(positiveTerms);
// };

// const getNegTerms = async (req, res) => {
//   const { asin } = req.query;
//   console.log("Received ASIN for neg terms:", asin);

//   const negativeTerms = [
//     "Terrible",
//     "Awful",
//     "Horrible",
//     "Poor",
//     "Bad",
//     "Dreadful",
//     "Unpleasant",
//     "Disappointing",
//     "Mediocre",
//     "Subpar",
//   ];

//   if (!asin) {
//     return res.status(400).json({ error: "ASIN is required" });
//   }
//   console.log("sent resp for ASIN:", asin);
//   return res.status(200).json(negativeTerms);
// };

// module.exports = { getPosTerms, getNegTerms };

const getPosTerms = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for positive terms:", asin);

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    // Query the database for positive keywords
    const [rows] = await pool.query(
      'SELECT positive_keywords FROM products WHERE parent_asin = ?',
      [asin]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No product found for the given ASIN" });
    }

    // Assuming positive_keywords is stored as a JSON string with a dictionary structure
    const positiveKeywords = JSON.parse(rows[0].positive_keywords);

    // Sort the positive terms by frequency in descending order and return only terms
    const sortedPositiveTerms = Object.entries(positiveKeywords)
      .sort((a, b) => b[1] - a[1])  // Sort by frequency in descending order
      .map(entry => entry[0]);  // Return only the terms

    console.log("Sent positive terms for ASIN:", asin);
    return res.status(200).json(sortedPositiveTerms);
  } catch (error) {
    console.error("Error fetching positive keywords:", error);
    return res.status(500).json({ error: "Failed to fetch positive terms" });
  }
};

const getNegTerms = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for negative terms:", asin);

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    // Query the database for negative keywords
    const [rows] = await pool.query(
      'SELECT negative_keywords FROM products WHERE parent_asin = ?',
      [asin]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No product found for the given ASIN" });
    }

    // Assuming negative_keywords is stored as a JSON string with a dictionary structure
    const negativeKeywords = JSON.parse(rows[0].negative_keywords);

    // Sort the negative terms by frequency in descending order and return only terms
    const sortedNegativeTerms = Object.entries(negativeKeywords)
      .sort((a, b) => b[1] - a[1])  // Sort by frequency in descending order
      .map(entry => entry[0]);  // Return only the terms

    console.log("Sent negative terms for ASIN:", asin);
    return res.status(200).json(sortedNegativeTerms);
  } catch (error) {
    console.error("Error fetching negative keywords:", error);
    return res.status(500).json({ error: "Failed to fetch negative terms" });
  }
};

module.exports = { getPosTerms, getNegTerms };