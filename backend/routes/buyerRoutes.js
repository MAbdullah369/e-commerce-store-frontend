const express = require('express');
const buyerController = require('../controllers/buyerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Cart routes
router.get('/cart', authMiddleware, roleMiddleware(['buyer']), buyerController.getCart);
router.post('/cart/add', authMiddleware, roleMiddleware(['buyer']), buyerController.addToCart);
router.put('/cart/update', authMiddleware, roleMiddleware(['buyer']), buyerController.updateCartItem);
router.delete('/cart/remove/:productId', authMiddleware, roleMiddleware(['buyer']), buyerController.removeFromCart);
router.delete('/cart/clear', authMiddleware, roleMiddleware(['buyer']), buyerController.clearCart);

// Wishlist routes
router.get('/wishlist', authMiddleware, roleMiddleware(['buyer']), buyerController.getWishlist);
router.post('/wishlist/add', authMiddleware, roleMiddleware(['buyer']), buyerController.addToWishlist);
router.delete('/wishlist/remove/:productId', authMiddleware, roleMiddleware(['buyer']), buyerController.removeFromWishlist);

module.exports = router;
