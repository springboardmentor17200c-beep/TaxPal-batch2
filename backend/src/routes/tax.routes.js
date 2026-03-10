const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middlewares/auth.middleware');
const taxController = require('../controllers/tax.controller');

router.use(protect);

router.post('/estimate', taxController.estimateTax);
router.post('/save', taxController.saveEstimate);
router.get('/', taxController.getEstimates);

module.exports = router;
