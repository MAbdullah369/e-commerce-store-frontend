const express = require('express');
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Seller registration
router.post('/register', authMiddleware, sellerController.registerAsSeller);

// Seller profile routes
router.get('/profile', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerProfile);
router.put('/profile', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.updateSellerProfile);

// Seller products
router.get('/products', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerProducts);

// Seller sales
router.get('/sales', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerSales);

// Shop status
router.get('/shop/status', authMiddleware, roleMiddleware(['seller']), sellerController.getShopStatus);

// Product publishing
router.post('/products/create', authMiddleware, roleMiddleware(['seller']), sellerController.createProduct);
router.patch('/products/:productId/publish', authMiddleware, roleMiddleware(['seller']), sellerController.publishProduct);

// Public routes
router.get('/', sellerController.getAllSellers);
router.get('/:sellerId', sellerController.getSellerById);

module.exports = router;
