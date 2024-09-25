const getSentimentwTime = async (req, res) => {
    const { asin } = req.query;
    console.log("Received ASIN for improvement:", asin);

    if (!asin) {
        return res.status(400).json({ error: 'ASIN is required' });
    }

    try {
        // Query the database to get improvements for the given ASIN
        const [rows] = await pool.query(
            `WITH ClassifiedReviews AS (
            SELECT 
            *,
            CASE 
            WHEN pos_score > neg_score THEN 'Positive'
            WHEN pos_score < neg_score THEN 'Negative'
            WHEN neu_score > pos_score AND neg_score THEN 'Neutral'
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

        // Return the result as JSON
        res.json(rows);
    } catch (error) {
        console.error('Error fetching sentiment data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getSentimentwTime };
