const getLineData = async (req, res) => {
    const { asin } = req.query;
    console.log('Received ASIN for line chart:', asin);
    const lineChartData = [
        [
          { x: new Date(2005, 0, 1), y: 70 },
          { x: new Date(2006, 0, 1), y: 70 },
          { x: new Date(2007, 0, 1), y: 36 },
          { x: new Date(2008, 0, 1), y: 38 },
          { x: new Date(2009, 0, 1), y: 30 },
          { x: new Date(2010, 0, 1), y: 27 },
          { x: new Date(2011, 0, 1), y: 29 },
        ],
        [
          { x: new Date(2005, 0, 1), y: 20 },
          { x: new Date(2006, 0, 1), y: 20 },
          { x: new Date(2007, 0, 1), y: 48 },
          { x: new Date(2008, 0, 1), y: 50 },
          { x: new Date(2009, 0, 1), y: 36 },
          { x: new Date(2010, 0, 1), y: 37 },
          { x: new Date(2011, 0, 1), y: 42 },
        ],

        [
          { x: new Date(2005, 0, 1), y: 10 },
          { x: new Date(2006, 0, 1), y: 10 },
          { x: new Date(2007, 0, 1), y: 16 },
          { x: new Date(2008, 0, 1), y: 12 },
          { x: new Date(2009, 0, 1), y: 34 },
          { x: new Date(2010, 0, 1), y: 36 },
          { x: new Date(2011, 0, 1), y: 29 },
        ],
      ];


    const lineCustomSeries = [
        {
          dataSource: lineChartData[0],
          xName: 'x',
          yName: 'y',
          name: 'Positive',
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          type: 'Line',
          color: '#66BB6A'  // Soft Green for Positive
        },
        {
          dataSource: lineChartData[1],
          xName: 'x',
          yName: 'y',
          name: 'Negative',
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          type: 'Line',
          color: '#EF5350'  // Soft Red for Negative
        },
        {
          dataSource: lineChartData[2],
          xName: 'x',
          yName: 'y',
          name: 'Neutral',
          width: '2',
          marker: { visible: true, width: 10, height: 10 },
          type: 'Line',
          color: '#42A5F5'  // Soft Blue for Neutral
        },
      ];
    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }
    console.log('sent resp for ASIN:', asin);
    return res.status(200).json(lineCustomSeries);
  };


module.exports = {
getLineData
};
