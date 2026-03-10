const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
    createDeadline,
    getDeadlines,
    updateDeadline,
    deleteDeadline
} = require('../controllers/deadline.controller');

router.use(protect);

router.post('/', createDeadline);
router.get('/', getDeadlines);
router.put('/:id', updateDeadline);
router.delete('/:id', deleteDeadline);

module.exports = router;
