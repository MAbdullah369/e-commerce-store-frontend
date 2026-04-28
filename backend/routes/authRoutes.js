const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/verify', authMiddleware, authController.verifyToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
