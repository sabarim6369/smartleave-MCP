const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getLeaveBalance,
  getPendingLeavesForApproval,
  approveLeave,
  rejectLeave,
  cancelMyLeave,
  getAllLeavesAdmin
} = require('../controllers/leaveController');

const { authenticateUser, requireRole } = require('../middleware/auth');

// All leave routes require authentication
router.use(authenticateUser);

// Employee routes
router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/balance', getLeaveBalance);
router.patch('/cancel/:leaveId', cancelMyLeave);

// Manager/Admin routes
router.get('/pending', requireRole(['manager', 'admin']), getPendingLeavesForApproval);
router.patch('/approve/:leaveId', requireRole(['manager', 'admin']), approveLeave);
router.patch('/reject/:leaveId', requireRole(['manager', 'admin']), rejectLeave);

// Admin only routes
router.get('/all', requireRole(['admin']), getAllLeavesAdmin);

module.exports = router;
