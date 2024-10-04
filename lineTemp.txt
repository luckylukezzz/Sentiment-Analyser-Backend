const getLineData = async (req, res) => {
  const { asin } = req.query;

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  console.log("Received ASIN for line chart:", asin);

  async function getLineChartData(parentAsin) {
    const pool = req.mysqlPool;
    try {
      // Await the query and get the correct part of the result
      const [rows] = await pool.query(
        `
        SELECT 
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
          year;
      `,
        [parentAsin]
      );

      // Check if rows is an array, else return error
      if (!rows || rows.length === 0) {
        return [];
      }

      // Transform the data
      const lineChartData = [
        // Positive scores
        rows.map((row) => ({
          x: new Date(row.year, 0, 1),
          y: Math.round(row.avg_positive_score),
        })),
        // Negative scores
        rows.map((row) => ({
          x: new Date(row.year, 0, 1),
          y: Math.round(row.avg_negative_score),
        })),
        // Neutral scores
        rows.map((row) => ({
          x: new Date(row.year, 0, 1),
          y: Math.round(row.avg_neutral_score),
        })),
      ];

      return lineChartData;
    } catch (err) {
      console.error("Error fetching line data:", err);
      return "error";
    }
  }

  try {
    const lineChartData = await getLineChartData(asin);
    console.log(lineChartData);
    if (lineChartData === "error" || lineChartData.length === 0) {
      return res.status(500).json({ error: "Error fetching line chart data" });
    }

    const lineCustomSeries = [
      {
        dataSource: lineChartData[0],
        xName: "x",
        yName: "y",
        name: "Positive",
        width: "2",
        marker: { visible: true, width: 10, height: 10 },
        type: "Line",
        color: "#66BB6A", // Soft Green for Positive
      },
      {
        dataSource: lineChartData[1],
        xName: "x",
        yName: "y",
        name: "Negative",
        width: "2",
        marker: { visible: true, width: 10, height: 10 },
        type: "Line",
        color: "#EF5350", // Soft Red for Negative
      },
      {
        dataSource: lineChartData[2],
        xName: "x",
        yName: "y",
        name: "Neutral",
        width: "2",
        marker: { visible: true, width: 10, height: 10 },
        type: "Line",
        color: "#42A5F5", // Soft Blue for Neutral
      },
    ];

    console.log("Sent response for ASIN:", asin);
    return res.status(200).json(lineCustomSeries);
  } catch (error) {
    console.error("Error in getLineData:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getLineData };
