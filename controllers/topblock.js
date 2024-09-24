  
// const getTopBlockData = async (req, res) => {
//     const { asin } = req.query;
//     console.log('Received ASIN sentiment:', asin);
  
//     const topBlock ={
//         'name' : 'iphone x',
//         'asin'  : asin,
//         'category' : 'Electronics and Accessories',
//         'noReviews' : 500,
//         'period' : '2021 Apr - 2024 Sep',
//     }
//     if (!asin) {
//       return res.status(400).json({ error: 'ASIN is required' });
//     }
//     console.log('sent resp for ASIN:', asin);
//     return res.status(200).json(topBlock);
//   };
    
//   module.exports = { getTopBlockData };
const connectDB = require('../db');
  
const getTopBlockData = async (req, res) => {
    const { asin } = req.query;
    console.log('Received ASIN sentiment:', asin);

    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }

    try{
      const connection = await connectDB();
      // Fetch the start date and end date of reviews for the given ASIN
      const [reviewPeriodRows] = await connection.query(
        `SELECT MIN(review_date) AS start_date, MAX(review_date) AS end_date 
         FROM reviews 
         WHERE parent_asin = ?`, 
        [asin]
      );

      // Fetch product details from the products table for the given ASIN
      const [productDetailsRows] = await connection.query(
          `SELECT product_name, main_category, review_count 
          FROM products 
          WHERE parent_asin = ?`, 
          [asin]
      );

      // Check if both queries returned valid data
      if (reviewPeriodRows.length === 0 || productDetailsRows.length === 0) {
          return res.status(404).json({ error: 'No data found for the given ASIN' });
      }

      // Format the period (start_date and end_date)
      const period = `${new Date(reviewPeriodRows[0].start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${new Date(reviewPeriodRows[0].end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`;

      // Construct the response data
      const topBlock = {
          name: productDetailsRows[0].product_name,
          asin: asin,
          category: productDetailsRows[0].main_category,
          noReviews: productDetailsRows[0].review_count,
          period: period,
      };

      console.log('Sent response for ASIN:', asin);
      return res.status(200).json(topBlock);
    } catch (err) {
      console.error('Error fetching top block data:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getTopBlockData };