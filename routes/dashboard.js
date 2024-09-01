const express = require('express');
const router = express.Router();
const { getEmotionData ,getSentimentData } = require('../controllers/pie'); 
const { getLineData } = require('../controllers/line');
const { getImprovementTips } = require('../controllers/improvement');
const { getPosTerms, getNegTerms } =require('../controllers/terms');
const { getTopBlockData } = require('../controllers/topblock')

router.route('/emotion-pie').get(getEmotionData);
router.route('/sentiment-pie').get(getSentimentData);
router.route('/line-data').get(getLineData);
router.route('/improvement').get(getImprovementTips);
router.route('/positive').get(getPosTerms);
router.route('/negative').get(getNegTerms);
router.route('/top-block').get(getTopBlockData);
module.exports = router;