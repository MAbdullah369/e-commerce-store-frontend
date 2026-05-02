const express = require('express');
const sellerController = require('../controllers/sellerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// ─────────────────────────────────────────────
// SHOP ROUTES
// ─────────────────────────────────────────────

// GET  /sellers/shop  — get logged-in seller's own shop
// POST /sellers/shop  — create a new shop (any authenticated user)
// PUT  /sellers/shop  — update shop details
router.get('/shop', authMiddleware, sellerController.getMyShop);
router.post('/shop', authMiddleware, sellerController.createShop);
router.put('/shop', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.updateShop);

// GET /sellers/shop/status — shop activation status
router.get('/shop/status', authMiddleware, roleMiddleware(['seller']), sellerController.getShopStatus);

// ─────────────────────────────────────────────
// DASHBOARD / STATS ROUTES
// ─────────────────────────────────────────────

// GET /sellers/stats   — overview stats for seller dashboard
// GET /sellers/orders  — orders containing seller's products
// GET /sellers/sales   — aggregated sales data
router.get('/stats', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerStats);
router.get('/orders', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerOrders);
router.get('/sales', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerSales);

// ─────────────────────────────────────────────
// PROFILE ROUTES (legacy aliases)
// ─────────────────────────────────────────────
router.get('/profile', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerProfile);
router.put('/profile', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.updateSellerProfile);

// ─────────────────────────────────────────────
// PRODUCT ROUTES (seller scoped)
// ─────────────────────────────────────────────

// GET    /sellers/products                        — list seller's products
// POST   /sellers/products/create                 — create a draft product
// PUT    /sellers/products/:productId             — update a product
// DELETE /sellers/products/:productId             — delete a product
// PATCH  /sellers/products/:productId/publish     — publish a product
router.get('/products', authMiddleware, roleMiddleware(['seller', 'admin']), sellerController.getSellerProducts);
router.post('/products/create', authMiddleware, roleMiddleware(['seller']), sellerController.createProduct);
router.put('/products/:productId', authMiddleware, roleMiddleware(['seller']), sellerController.updateProduct);
router.delete('/products/:productId', authMiddleware, roleMiddleware(['seller']), sellerController.deleteProduct);
router.patch('/products/:productId/publish', authMiddleware, roleMiddleware(['seller']), sellerController.publishProduct);

// ─────────────────────────────────────────────
// LEGACY REGISTRATION ROUTE
// ─────────────────────────────────────────────
router.post('/register', authMiddleware, sellerController.registerAsSeller);

// ─────────────────────────────────────────────
// PUBLIC ROUTES  (no auth required)
// Must be LAST — otherwise /:sellerId matches /shop, /stats etc.
// ─────────────────────────────────────────────
router.get('/', sellerController.getAllSellers);
router.get('/:sellerId', sellerController.getSellerById);

module.exports = router;