const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile Routes
router.get('/:id', authController.getProfile); // Get user profile
router.put('/:id', authController.updateProfile); // Update user profile

// Update sensitive information (email, password)
router.put('/:id/update-email', authController.updateEmail); // Update email
router.put('/:id/update-password', authController.updatePassword); // Update password

// Update other profile details
module.exports = router;
