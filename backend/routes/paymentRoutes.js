const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Payment routes
router.post('/', authMiddleware, paymentController.createPayment);
router.post('/:paymentId/process', authMiddleware, paymentController.processPayment);
router.get('/:paymentId', authMiddleware, paymentController.getPaymentDetails);
router.post('/:paymentId/refund', authMiddleware, roleMiddleware(['admin']), paymentController.refundPayment);

// Order payments
router.get('/order/:orderId', authMiddleware, paymentController.getOrderPayments);

// User payments
router.get('/user/history', authMiddleware, paymentController.getUserPayments);

module.exports = router;
