const express = require('express');
const router = express.Router();
const { getEmotionData, getSentimentData } = require('../controllers/pie');
const { getLineData } = require('../controllers/line');
const { getImprovementTips } = require('../controllers/improvement');
const { getPosTerms, getNegTerms } = require('../controllers/terms');
const { getTopBlockData } = require('../controllers/topblock');
const { searchProducts } = require('../controllers/search');
const { getLimeInfo } = require('../controllers/lime');
const { getAspectInfo } = require('../controllers/aspect');
const { runPythonScript } = require('../controllers/pythonExecutor'); // Add this line

router.route('/emotion-pie').get(getEmotionData);
router.route('/sentiment-pie').get(getSentimentData);
router.route('/line-data').get(getLineData);
router.route('/improvement').get(getImprovementTips);
router.route('/positive').get(getPosTerms);
router.route('/negative').get(getNegTerms);
router.route('/top-block').get(getTopBlockData);
router.route('/search').get(searchProducts);
router.route('/lime-info').get(getLimeInfo);
router.route('/aspect-info').get(getAspectInfo);

// Add the new route for executing the Python script
router.route('/process-reviews').post(async (req, res) => {
    const { asin } = req.body;

    if (!asin) {
        return res.status(400).json({ error: 'ASIN is required' });
    }

    try {
        const result = await runPythonScript(asin);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error processing reviews:', error);
        res.status(500).json({ error: 'An error occurred while processing reviews' });
    }
});

module.exports = router;