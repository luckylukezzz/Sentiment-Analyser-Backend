const express = require('express');
const dashboardRoutes = require('./dashboard'); 
const userRoutes =require('./user');

const router = express.Router();

router.use('/dashboard', dashboardRoutes);
router.use('/',userRoutes);

module.exports = router;
