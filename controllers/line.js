// const getSentimentwTime = async (req, res) => {
//     const { asin } = req.query;
//     console.log("Received ASIN for improvement:", asin);

//     if (!asin) {
//         return res.status(400).json({ error: 'ASIN is required' });
//     }

//     try {
//         // Query the database to get improvements for the given ASIN
//         const [rows] = await pool.query(
//             `WITH ClassifiedReviews AS (
//             SELECT 
//             *,
//             CASE 
//             WHEN pos_score > neg_score THEN 'Positive'
//             WHEN pos_score < neg_score THEN 'Negative'
//             ELSE 'Neutral'
//             END AS sentiment_classification
//             FROM reviews
//             WHERE parent_asin = ? 
//             ),
//             FourMonthGroups AS (
//             SELECT 
//             *,
//             CONCAT(YEAR(review_date), '-', FLOOR((MONTH(review_date) - 1) / 4) + 1) AS four_month_group
//             FROM ClassifiedReviews
//             )
//             SELECT
//             four_month_group,
//             COUNT(CASE WHEN sentiment_classification = 'Positive' THEN 1 END) / COUNT(*) AS positive_percentage,
//             COUNT(CASE WHEN sentiment_classification = 'Negative' THEN 1 END) / COUNT(*) AS negative_percentage
//             FROM FourMonthGroups
//             GROUP BY four_month_group;`,
//             [asin]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "No product found for the given ASIN" });
//         }

//         // Return the result as JSON
//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching sentiment data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = { getSentimentwTime };

const connectDB = require('../db');

const getLineData = async (req, res) => {
  const { asin } = req.query;
  console.log("Received ASIN for improvement:", asin);

  if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
  }

  try{
    const connection = await connectDB();
    // Query the database to get improvements for the given ASIN
    const [rows] = await connection.query(
      `SELECT 
          YEAR(FROM_UNIXTIME(timestamp / 1000)) AS year,
          AVG(pos_score) * 100 AS avg_positive_score,
          AVG(neg_score) * 100 AS avg_negative_score,
          AVG(neu_score) * 100 AS avg_neutral_score
      FROM 
          reviews
      WHERE 
          parent_asin = ?
      GROUP BY 
          year
      ORDER BY 
          year;`,
      [asin]
    );

    // Transform the database rows into the line chart data format
    const positiveData = [];
    const negativeData = [];
    const neutralData = [];

    rows.forEach(row => {
      positiveData.push({ x: new Date(row.year, 0, 1), y: row.avg_positive_score });
      negativeData.push({ x: new Date(row.year, 0, 1), y: row.avg_negative_score });
      neutralData.push({ x: new Date(row.year, 0, 1), y: row.avg_neutral_score });
    });

    const lineChartData = [positiveData, negativeData, neutralData];

  // const lineChartData = [
  //     [
  //       { x: new Date(2005, 0, 1), y: 70 },
  //       { x: new Date(2006, 0, 1), y: 70 },
  //       { x: new Date(2007, 0, 1), y: 36 },
  //       { x: new Date(2008, 0, 1), y: 38 },
  //       { x: new Date(2009, 0, 1), y: 30 },
  //       { x: new Date(2010, 0, 1), y: 27 },
  //       { x: new Date(2011, 0, 1), y: 29 },
  //     ],
  //     [
  //       { x: new Date(2005, 0, 1), y: 20 },
  //       { x: new Date(2006, 0, 1), y: 20 },
  //       { x: new Date(2007, 0, 1), y: 48 },
  //       { x: new Date(2008, 0, 1), y: 50 },
  //       { x: new Date(2009, 0, 1), y: 36 },
  //       { x: new Date(2010, 0, 1), y: 37 },
  //       { x: new Date(2011, 0, 1), y: 42 },
  //     ],
    
  //     [
  //       { x: new Date(2005, 0, 1), y: 10 },
  //       { x: new Date(2006, 0, 1), y: 10 },
  //       { x: new Date(2007, 0, 1), y: 16 },
  //       { x: new Date(2008, 0, 1), y: 12 },
  //       { x: new Date(2009, 0, 1), y: 34 },
  //       { x: new Date(2010, 0, 1), y: 36 },
  //       { x: new Date(2011, 0, 1), y: 29 },
  //     ],
  //   ];
    

    const lineCustomSeries = [
        {
          dataSource: lineChartData[0],
          xName: 'Year',
          yName: 'Sentiment Percentage',
          name: 'Positive',
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          type: 'Line',
          color: '#66BB6A'  // Soft Green for Positive
        },
        {
          dataSource: lineChartData[1],
          xName: 'Year',
          yName: 'Sentiment Percentage',
          name: 'Negative',
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          type: 'Line',
          color: '#EF5350'  // Soft Red for Negative
        },
        {
          dataSource: lineChartData[2],
          xName: 'Year',
          yName: 'Sentiment Percentage',
          name: 'Neutral',
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          type: 'Line',
          color: '#42A5F5'  // Soft Blue for Neutral
        },
    ];
    console.log('Sent response for ASIN:', asin);
    return res.status(200).json(lineCustomSeries);
} catch (err) {
  console.error('Error fetching line chart data:', err);
  return res.status(500).json({ error: 'Internal server error' });
}
}

module.exports = { getLineData };

