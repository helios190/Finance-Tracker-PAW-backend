const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile Routes
router.get('/profile/:id', authController.getProfile); // Get user profile
router.put('/profile/:id', authController.updateProfile); // Update user profile

// Update sensitive information (email, password)
router.put('/user/:id/update-email', authController.updateEmail); // Update email
router.put('/user/:id/update-password', authController.updatePassword); // Update password

// Update other profile details
router.put('/user/:id/update-profile', authController.updateProfileDetails); // Update other profile details
module.exports = router;
