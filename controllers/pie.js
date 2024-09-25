const connectDB = require('../db'); 

const getEmotionData = async (req, res) => {
    const { asin } = req.query;
    console.log('Received ASIN for emote:', asin);

    // const pieChartData = [
    //   { x: 'Love It', y: 40, text: '40%', color: '#ff6f61' },   // Warm Coral
    //   { x: 'Happy', y: 25, text: '25%', color: '#ffd54f' },     // Bright Yellow
    //   { x: 'Neutral', y: 20, text: '20%', color: '#80cbc4' },   // Soft Teal
    //   { x: 'Angry', y: 10, text: '10%', color: '#ff8a80' },     // Soft Red
    //   { x: 'Frustrated', y: 5, text: '5%', color: '#ba68c8' },  // Soft Purple
    // ];
    // if (!asin) {
    //   return res.status(400).json({ error: 'ASIN is required' });
    // }
    // console.log('sent resp for ASIN:', asin);
    // return res.status(200).json(pieChartData);

    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }

    // Function to generate a random hex color
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    try{
      const pool = req.mysqlPool;

      // Execute the query to get emotion percentages from the database
      const [rows] = await pool.query(
        `SELECT 
            emotion,
            (COUNT(emotion) / (SELECT COUNT(*) FROM reviews WHERE parent_asin = ?)) * 100 AS emotion_percentage
         FROM 
            reviews
         WHERE 
            parent_asin = ?
         GROUP BY 
            emotion`, 
        [asin, asin]
      );

      console.log('Rows:', rows);

      const pieChartData = rows.map(row => {
        // Parse the emotion_percentage to a float
        const emotionPercentage = parseFloat(row.emotion_percentage);

        // Ensure it’s a valid number; if not, default to 0
        const validPercentage = isNaN(emotionPercentage) ? 0 : emotionPercentage;

        return {
            x: row.emotion, // Emotion name
            y: validPercentage, // Parsed percentage
            text: `${validPercentage.toFixed(2)}%`, // Format percentage with 2 decimals
            color: getRandomColor() // Generate random color
        };
    });

      console.log('Sent response for ASIN:', asin);
      return res.status(200).json(pieChartData); // Return the pie chart data
    }catch(err){
      console.error('Error fetching emotion data:', err);
      return res.status(500).json({ error: 'Internal server error'});
    }
  };

  
const getSentimentData = async (req, res) => {
  const { asin } = req.query;
  console.log('Received ASIN sentiment:', asin);

  if (!asin) {
    // Execute the query to get sentiment percentages from the database
    return res.status(400).json({ error: 'ASIN is required' });
  }

  try{
    const pool = req.mysqlPool;
    const [rows] = await pool.query(
      `SELECT 
          SUM(CASE WHEN pos_score >= GREATEST(neu_score, neg_score) THEN 1 ELSE 0 END) * 100 / (SELECT COUNT(*) FROM reviews WHERE parent_asin = ?) AS positive,
          SUM(CASE WHEN neu_score >= GREATEST(pos_score, neg_score) THEN 1 ELSE 0 END) * 100 / (SELECT COUNT(*) FROM reviews WHERE parent_asin = ?) AS neutral,
          SUM(CASE WHEN neg_score >= GREATEST(pos_score, neu_score) THEN 1 ELSE 0 END) * 100 / (SELECT COUNT(*) FROM reviews WHERE parent_asin = ?) AS negative
      FROM reviews 
      WHERE parent_asin = ?`,
      [asin, asin, asin, asin]
    );

    // Extract data from the query result
    const { positive, neutral, negative } = rows[0];

    console.log('Rows:', rows);
    console.log('Positive:', positive);
    
    // // Prepare pie chart data with the sentiment percentages
    // const pieChartData = [
    //   { x: 'Positive', y: positive, text: `${positive.toFixed(2)}%`, color: '#00bdae' },  // Soft Green
    //   { x: 'Neutral', y: neutral, text: `${neutral.toFixed(2)}%`, color: '#357cd2' },    // Soft Grey/Blue
    //   { x: 'Negative', y: negative, text: `${negative.toFixed(2)}%`, color: '#FF8A80' },  // Soft Red
    // ];

    // Function to safely parse sentiment values
    const parseSentiment = (value) => {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? 0 : parsedValue; // Return 0 if value is not a number
    };

    // Prepare pie chart data with the sentiment percentages
    const pieChartData = [
      { x: 'Positive', y: parseSentiment(positive), text: `${parseSentiment(positive).toFixed(2)}%`, color: '#00bdae' },  // Soft Green
      { x: 'Neutral', y: parseSentiment(neutral), text: `${parseSentiment(neutral).toFixed(2)}%`, color: '#357cd2' },    // Soft Grey/Blue
      { x: 'Negative', y: parseSentiment(negative), text: `${parseSentiment(negative).toFixed(2)}%`, color: '#FF8A80' },  // Soft Red
    ];

    console.log('Sent response for ASIN:', asin);
    return res.status(200).json(pieChartData); // Return the pie chart data

  }catch(err){
    console.error('Error fetching sentiment data:', err);
    return res.status(500).json({ error: 'Internal server error' });
  };

};

module.exports = { getEmotionData, getSentimentData };