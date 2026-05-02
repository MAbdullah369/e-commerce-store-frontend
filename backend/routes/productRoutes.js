const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ⚠️ Order matters — specific paths MUST come before /:id
// otherwise Express matches 'categories' as an id param
// ─────────────────────────────────────────────
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getAllCategories);           // ✅ before /:id
router.get('/category/:categoryId', productController.getProductsByCategory); // ✅ before /:id
router.get('/:id', productController.getProductById);                   // ✅ last

// ─────────────────────────────────────────────
// SELLER / ADMIN ROUTES
// No upload middleware — sellers send image as URL string, not file upload
// ─────────────────────────────────────────────
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['seller', 'admin']),
  productController.deleteProduct
);

module.exports = router;