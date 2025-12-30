const express = require('express');
const {
  getUsers,
  updateUserStatus,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.patch('/me/password', changePassword);

router.get('/', requireAdmin, getUsers);
router.patch('/:id/status', requireAdmin, updateUserStatus);

module.exports = router;


