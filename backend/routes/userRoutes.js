const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Protected routes
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// Admin routes
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.delete('/:userId', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;
