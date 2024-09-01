const express = require('express');
const router = express.Router();
const { getEmotionData ,getSentimentData } = require('../controllers/pie'); 


router.route('/emotion-pie').get(getEmotionData);
router.route('/sentiment-pie').get(getSentimentData);

module.exports = router;
