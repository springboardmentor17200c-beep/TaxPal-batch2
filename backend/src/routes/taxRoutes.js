
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const taxController = require('../controllers/taxController');

router.use(protect);

router.post('/estimate', taxController.estimateTax);
router.post('/save', taxController.saveEstimate);
router.get("/estimates", taxController.getEstimates);
router.post("/calculate", protect, taxController.estimateTax);
module.exports = router;
