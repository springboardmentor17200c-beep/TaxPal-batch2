const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const reportController = require('../controllers/report.controller');

router.use(protect);

router.post('/generate', reportController.generateReport);
router.get('/', reportController.getReports);

module.exports = router;
