const express = require('express');
const router = express.Router();
const { getUserSettings, updateProfile, updatePassword, updatePreferences }=require('../controllers/settingsController');
const isAuthenticated = require('../middleware/authMiddleware');

// Get user settings
router.get('/', isAuthenticated, getUserSettings);

// Update profile
router.put('/update', isAuthenticated, updateProfile);

// Update password
router.put('/password', isAuthenticated, updatePassword);

// Update preferences
// router.put('/preferences', isAuthenticated, updatePreferences);

module.exports = router;