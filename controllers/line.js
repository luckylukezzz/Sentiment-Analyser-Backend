const getSentimentwTime = async (req, res) => {
    const { asin } = req.query;
    console.log("Received ASIN for improvement:", asin);

    if (!asin) {
        return res.status(400).json({ error: 'ASIN is required' });
    }

    try {
        // Query the database to get sentiment data grouped by four-month periods
        const [rows] = await pool.query(
            `WITH ClassifiedReviews AS (
            SELECT 
            *,
            CASE
                WHEN pos_score > neg_score AND pos_score > neu_score THEN 'Positive'
                WHEN neg_score > pos_score AND neg_score > neu_score THEN 'Negative'
                ELSE 'Neutral'
            END AS sentiment_classification
            FROM reviews
            WHERE parent_asin = ? 
            ),
            FourMonthGroups AS (
            SELECT 
            *,
            CONCAT(YEAR(review_date), '-', FLOOR((MONTH(review_date) - 1) / 4) + 1) AS four_month_group
            FROM ClassifiedReviews
            )
            SELECT
            four_month_group,
            COUNT(CASE WHEN sentiment_classification = 'Positive' THEN 1 END) / COUNT(*) AS positive_percentage,
            COUNT(CASE WHEN sentiment_classification = 'Negative' THEN 1 END) / COUNT(*) AS negative_percentage,
            COUNT(CASE WHEN sentiment_classification = 'Neutral' THEN 1 END) / COUNT(*) AS neutral_percentage
            FROM FourMonthGroups
            GROUP BY four_month_group;`,
            [asin]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "No product found for the given ASIN" });
        }

        // Transform the query result into chart-friendly format
        const positiveSeries = {
            name: "Positive",
            dataSource: rows.map(row => ({
                xName: row.four_month_group,
                yName: row.positive_percentage * 100  // Convert to percentage
            })),
            type: "Line",
            fill: "#4CAF50",  // Green for positive
            width: 2,
            marker: { visible: true }
        };

        const negativeSeries = {
            name: "Negative",
            dataSource: rows.map(row => ({
                xName: row.four_month_group,
                yName: row.negative_percentage * 100  // Convert to percentage
            })),
            type: "Line",
            fill: "#F44336",  // Red for negative
            width: 2,
            marker: { visible: true }
        };

        const neutralSeries = {
            name: "Neutral",
            dataSource: rows.map(row => ({
                xName: row.four_month_group,
                yName: row.neutral_percentage * 100  // Convert to percentage
            })),
            type: "Line",
            fill: "#FFC107",  // Yellow for neutral
            width: 2,
            marker: { visible: true }
        };

        // Send the transformed data to the frontend
        res.json([positiveSeries, negativeSeries, neutralSeries]);
    } catch (error) {
        console.error('Error fetching sentiment data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getSentimentwTime };
