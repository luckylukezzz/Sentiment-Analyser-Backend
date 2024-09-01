const express = require('express');
const router = express.Router();
const { getEmotionData ,getSentimentData } = require('../controllers/pie'); 
const { getLineData } = require('../controllers/line');


router.route('/emotion-pie').get(getEmotionData);
router.route('/sentiment-pie').get(getSentimentData);
router.route('/line-data').get(getLineData);
module.exports = router;
