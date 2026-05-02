const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// ─────────────────────────────────────────────
// ⚠️ Specific paths MUST come before /:paymentId
// otherwise 'order' and 'user' get matched as paymentId
// ─────────────────────────────────────────────

// Specific routes first
router.get('/user/history', authMiddleware, paymentController.getUserPayments);
router.get('/order/:orderId', authMiddleware, paymentController.getOrderPayments);

// Generic payment routes
router.post('/', authMiddleware, paymentController.createPayment);
router.get('/:paymentId', authMiddleware, paymentController.getPaymentDetails);
router.post('/:paymentId/process', authMiddleware, paymentController.processPayment);
router.post('/:paymentId/refund', authMiddleware, roleMiddleware(['admin']), paymentController.refundPayment);

module.exports = router;