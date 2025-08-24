const express = require('express');
const router = express.Router();
const {getDashboardData, setInitialBalance} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getDashboardData);
router.post('/initial-balance', authMiddleware, setInitialBalance);

module.exports = router;