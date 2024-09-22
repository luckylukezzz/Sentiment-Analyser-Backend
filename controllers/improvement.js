const getImprovementTips = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for improvement:", asin);

  // const improvementTips = [
  //   "Increase battery life to extend usage time and reduce customer complaints about frequent charging.",
  //   "Improve the durability of materials used to enhance product longevity and reduce wear and tear.",
  //   "Expand color options to appeal to a broader demographic and match customer preferences.",
  //   "Optimize the user interface for better accessibility, ensuring that all users can easily navigate the product.",
  //   "Enhance packaging to provide better protection during shipping and improve the unboxing experience.",
  //   "Reduce the weight of the product to make it more portable and convenient for users on the go.",
  //   "Offer customizable features to allow customers to personalize the product according to their needs.",
  //   "Increase the clarity of the instruction manual to reduce user confusion and improve setup time.",
  //   "Upgrade the camera quality to provide sharper and more vibrant images, meeting customer expectations.",
  //   "Add more connectivity options, such as Bluetooth and Wi-Fi, to increase the product's versatility.",
  //   "Introduce a loyalty program or discount for repeat purchases to encourage customer retention.",
  //   "Reduce the product's environmental impact by using eco-friendly materials and sustainable practices.",
  // ];

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    // Query the database to get improvements for the given ASIN
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
