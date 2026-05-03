const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// ─────────────────────────────────────────────
// ⚠️ SPECIFIC routes MUST come before /:id
// otherwise Express matches 'admin' as an order ID
// ─────────────────────────────────────────────

// Admin routes — defined FIRST
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), orderController.getAllOrders);
router.put('/admin/:id/status', authMiddleware, roleMiddleware(['admin']), orderController.updateOrderStatus);

// Buyer routes
router.get('/', authMiddleware, orderController.getBuyerOrders);
router.post('/', authMiddleware, orderController.createOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);
router.put('/:id/ship', authMiddleware, roleMiddleware(['seller', 'admin']), orderController.shipOrder);
router.put('/:id/receive', authMiddleware, orderController.receiveOrder);
router.post('/:id/review', authMiddleware, orderController.submitReview);
router.post('/:id/return', authMiddleware, orderController.requestReturn);

module.exports = router;