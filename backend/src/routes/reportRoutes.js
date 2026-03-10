
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const reportController = require('../controllers/reportController');

router.use(protect);

router.post('/generate', reportController.generateReport);
router.get('/', reportController.getReports);

module.exports = router;
