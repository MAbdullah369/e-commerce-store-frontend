const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin middleware
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Review management
router.post('/reviews/:reviewId/helpful', adminController.markHelpful);
router.delete('/reviews/:reviewId', adminController.deleteReview);

module.exports = router;
