const express = require('express');
const router = express.Router();
const {
  login,
  register,
  getProfile,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../controllers/authController');

const { authenticateUser, requireRole } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.post('/register', authenticateUser, requireRole(['admin']), register);
router.get('/profile', authenticateUser, getProfile);
router.get('/users', authenticateUser, requireRole(['admin', 'manager']), getUsers);
router.get('/users/:id', authenticateUser, requireRole(['admin', 'manager']), getUserById);
router.put('/users/:id', authenticateUser, requireRole(['admin']), updateUserById);
router.delete('/users/:id', authenticateUser, requireRole(['admin']), deleteUserById);

module.exports = router;
