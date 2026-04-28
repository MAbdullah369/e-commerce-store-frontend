const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getAllCategories);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Seller/Admin routes
router.post('/', authMiddleware, roleMiddleware(['seller', 'admin']), upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware(['seller', 'admin']), upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware(['seller', 'admin']), productController.deleteProduct);

module.exports = router;
