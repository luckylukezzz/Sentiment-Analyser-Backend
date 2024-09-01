const getEmotionData = async (req, res) => {
    const { asin } = req.query;
    console.log('Received ASIN for emote:', asin);

    const pieChartData = [
      { x: 'Love It', y: 40, text: '40%', color: '#ff6f61' },   // Warm Coral
      { x: 'Happy', y: 25, text: '25%', color: '#ffd54f' },     // Bright Yellow
      { x: 'Neutral', y: 20, text: '20%', color: '#80cbc4' },   // Soft Teal
      { x: 'Angry', y: 10, text: '10%', color: '#ff8a80' },     // Soft Red
      { x: 'Frustrated', y: 5, text: '5%', color: '#ba68c8' },  // Soft Purple
    ];
    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }
    console.log('sent resp for ASIN:', asin);
    return res.status(200).json(pieChartData);
  };

  
const getSentimentData = async (req, res) => {
  const { asin } = req.query;
  console.log('Received ASIN sentiment:', asin);

  const pieChartData = [
    { x: 'Positive', y: 70, text: '70%', color: '#00bdae' },  // Soft Green
    { x: 'Negative', y:20, text: '20%', color: '#FF8A80' },   // Soft Red
    { x: 'Neutral', y: 10, text: '10%', color: '#357cd2' },   // Soft Grey
  ];
  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required' });
  }
  console.log('sent resp for ASIN:', asin);
  return res.status(200).json(pieChartData);
};
  
module.exports = { getEmotionData, getSentimentData };
  