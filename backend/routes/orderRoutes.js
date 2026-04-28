const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Buyer routes
router.get('/', authMiddleware, orderController.getBuyerOrders);
router.post('/', authMiddleware, orderController.createOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

// Admin routes
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), orderController.updateOrderStatus);
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), orderController.getAllOrders);

module.exports = router;
