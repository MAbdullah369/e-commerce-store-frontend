const express = require('express');
const buyerController = require('../controllers/buyerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Cart routes
router.get('/cart', authMiddleware, buyerController.getCart);
router.post('/cart/add', authMiddleware, buyerController.addToCart);
router.put('/cart/update', authMiddleware, buyerController.updateCartItem);
router.delete('/cart/remove/:productId', authMiddleware, buyerController.removeFromCart);
router.delete('/cart/clear', authMiddleware, buyerController.clearCart);

// Wishlist routes
router.get('/wishlist', authMiddleware, buyerController.getWishlist);
router.post('/wishlist/add', authMiddleware, buyerController.addToWishlist);
router.delete('/wishlist/remove/:productId', authMiddleware, buyerController.removeFromWishlist);

module.exports = router;
