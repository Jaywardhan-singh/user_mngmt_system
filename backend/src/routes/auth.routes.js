const express = require('express');
const { signup, login, getCurrentUser, adminSignup, userSignup } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Legacy endpoints (for backward compatibility)
router.post('/signup', signup);
router.post('/login', login);

// Separate admin endpoints
router.post('/admin/signup', adminSignup);
router.post('/admin/login', login);

// Separate user endpoints
router.post('/user/signup', userSignup);
router.post('/user/login', login);

router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;


