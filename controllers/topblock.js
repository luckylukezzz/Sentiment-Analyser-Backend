  
const getTopBlockData = async (req, res) => {
    const { asin } = req.query;
    console.log('Received ASIN sentiment:', asin);
  
    const topBlock ={
        'name' : 'iphone x',
        'asin'  : asin,
        'category' : 'Electronics and Accessories',
        'noReviews' : 500,
        'period' : '2021 Apr - 2024 Sep',
    }
    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }
    console.log('sent resp for ASIN:', asin);
    return res.status(200).json(topBlock);
  };
    
  module.exports = { getTopBlockData };