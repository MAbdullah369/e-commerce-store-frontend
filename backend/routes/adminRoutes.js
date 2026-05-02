const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin middleware
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// ==================== DASHBOARD ====================
router.get('/dashboard', adminController.getDashboard);

// ==================== USER MANAGEMENT ====================
router.get('/users', adminController.getUsers);
router.get('/users/active', adminController.getActiveUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/deactivate', adminController.deactivateUser);
router.patch('/users/:userId/activate', adminController.activateUser);

// ==================== SELLER MANAGEMENT ====================
router.get('/sellers', adminController.getAllSellers);
router.get('/sellers/active', adminController.getActiveSellers);
router.patch('/sellers/:shopId/approve', adminController.approveSeller);
router.patch('/sellers/:shopId/suspend', adminController.suspendSeller);

// ==================== CATEGORY MANAGEMENT ====================
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.patch('/categories/:categoryId', adminController.updateCategory);
router.delete('/categories/:categoryId', adminController.deleteCategory);

// ==================== PRODUCT MANAGEMENT ====================
router.get('/products', adminController.getAllProducts);
router.delete('/products/:productId', adminController.deleteProduct);

// ==================== REVIEW MANAGEMENT ====================
router.delete('/reviews/:reviewId', adminController.deleteReview);
router.post('/reviews/:reviewId/helpful', adminController.markHelpful);

module.exports = router;
