const getLimeInfo = async (req, res) => {
    const pool = req.mysqlPool;
    const parentAsin = req.query.asin;
    console.log(parentAsin)
    if (!parentAsin) {
        return res.status(400).json({ error: 'Parent ASIN is required' });
    }

    try {
        const [reviews] = await pool.query(
            "SELECT review_id, text, lime FROM reviews WHERE parent_asin = ? AND lime IS NOT NULL",
            [parentAsin]
        );

        const newJsonStructure = {};
        reviews.forEach((review, index) => {
            const reviewKey = `review${index + 1}`;
            const limeData = review.lime;
            newJsonStructure[reviewKey] = {
                ...limeData
            };
        });

        res.json(newJsonStructure);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'An error occurred while fetching reviews' });
    }
};

module.exports = { getLimeInfo };