const {
  createLeave,
  getLeaveById,
  getLeavesByUserId,
  getAllLeaves,
  getPendingLeaves,
  getPendingLeavesByManagerId,
  updateLeaveStatus,
  cancelLeave,
  getUsedLeaveDays,
  LEAVE_TYPES,
  LEAVE_STATUS
} = require('../models/leave');

const {
  findUserById,
  getUsersByManagerId,
  updateLeaveBalance,
  DEFAULT_LEAVE_BALANCE
} = require('../models/user');

// Calculate number of days between two dates (excluding weekends)
const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let days = 0;
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    // Exclude Saturdays (6) and Sundays (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
};

// Apply for leave
const applyLeave = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validation
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Leave type, start date, end date, and reason are required'
      });
    }

    // Validate leave type
    if (!Object.values(LEAVE_TYPES).includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave type'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past'
      });
    }

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be before start date'
      });
    }

    // Calculate leave days
    const days = calculateLeaveDays(startDate, endDate);

    if (days === 0) {
      return res.status(400).json({
        success: false,
        message: 'Leave period must include at least one working day'
      });
    }

    // Check leave balance (except for unpaid leave)
    if (leaveType !== LEAVE_TYPES.UNPAID) {
      const user = findUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const currentYear = new Date().getFullYear();
      const usedDays = getUsedLeaveDays(userId, leaveType, currentYear);
      const availableBalance = user.leaveBalance[leaveType] - usedDays;

      if (days > availableBalance) {
        return res.status(400).json({
          success: false,
          message: `Insufficient leave balance. Available: ${availableBalance} days, Requested: ${days} days`
        });
      }
    }

    // Create leave application
    const leave = createLeave({
      userId,
      leaveType,
      startDate,
      endDate,
      days,
      reason
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: leave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get my leaves
const getMyLeaves = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { status } = req.query;

    let leaves = getLeavesByUserId(userId);

    if (status) {
      leaves = leaves.filter(l => l.status === status);
    }

    res.json({
      success: true,
      data: leaves,
      count: leaves.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get leave balance
const getLeaveBalance = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentYear = new Date().getFullYear();
    
    // Calculate balance for each leave type
    const balance = {};
    Object.values(LEAVE_TYPES).forEach(type => {
      const total = user.leaveBalance[type] || 0;
      const used = getUsedLeaveDays(userId, type, currentYear);
      const available = total - used;

      balance[type] = {
        total,
        used,
        available
      };
    });

    res.json({
      success: true,
      data: {
        year: currentYear,
        balance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get pending leaves (for manager/admin)
const getPendingLeavesForApproval = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let pendingLeaves;

    if (user.role === 'admin') {
      // Admin can see all pending leaves
      pendingLeaves = getPendingLeaves();
    } else if (user.role === 'manager') {
      // Manager can see pending leaves of their team members
      const teamMembers = getUsersByManagerId(userId);
      const teamMemberIds = teamMembers.map(tm => tm.id);
      pendingLeaves = getPendingLeavesByManagerId(userId, teamMemberIds);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers and admins can view pending leaves.'
      });
    }

    // Get user details for each leave
    const leavesWithUserDetails = pendingLeaves.map(leave => {
      const leaveUser = findUserById(leave.userId);
      return {
        ...leave,
        user: leaveUser ? {
          id: leaveUser.id,
          name: leaveUser.name,
          email: leaveUser.email,
          employeeId: leaveUser.employeeId,
          department: leaveUser.department
        } : null
      };
    });

    res.json({
      success: true,
      data: leavesWithUserDetails,
      count: leavesWithUserDetails.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve leave
const approveLeave = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { leaveId } = req.params;

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has permission to approve
    if (user.role !== 'manager' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers and admins can approve leaves.'
      });
    }

    const leave = getLeaveById(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    if (leave.status !== LEAVE_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Cannot approve leave with status: ${leave.status}`
      });
    }

    // If manager, check if the leave belongs to their team member
    if (user.role === 'manager') {
      const leaveUser = findUserById(leave.userId);
      if (!leaveUser || leaveUser.managerId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only approve leaves of your team members.'
        });
      }
    }

    const updatedLeave = updateLeaveStatus(leaveId, LEAVE_STATUS.APPROVED, userId);

    res.json({
      success: true,
      message: 'Leave approved successfully',
      data: updatedLeave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject leave
const rejectLeave = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { leaveId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has permission to reject
    if (user.role !== 'manager' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers and admins can reject leaves.'
      });
    }

    const leave = getLeaveById(leaveId);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    if (leave.status !== LEAVE_STATUS.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Cannot reject leave with status: ${leave.status}`
      });
    }

    // If manager, check if the leave belongs to their team member
    if (user.role === 'manager') {
      const leaveUser = findUserById(leave.userId);
      if (!leaveUser || leaveUser.managerId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only reject leaves of your team members.'
        });
      }
    }

    const updatedLeave = updateLeaveStatus(leaveId, LEAVE_STATUS.REJECTED, userId, reason);

    res.json({
      success: true,
      message: 'Leave rejected successfully',
      data: updatedLeave
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel leave
const cancelMyLeave = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { leaveId } = req.params;

    const leave = cancelLeave(leaveId, userId);

    res.json({
      success: true,
      message: 'Leave cancelled successfully',
      data: leave
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all leaves (admin only)
const getAllLeavesAdmin = (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { status } = req.query;

    const user = findUserById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    let leaves = getAllLeaves();

    if (status) {
      leaves = leaves.filter(l => l.status === status);
    }

    // Get user details for each leave
    const leavesWithUserDetails = leaves.map(leave => {
      const leaveUser = findUserById(leave.userId);
      return {
        ...leave,
        user: leaveUser ? {
          id: leaveUser.id,
          name: leaveUser.name,
          email: leaveUser.email,
          employeeId: leaveUser.employeeId,
          department: leaveUser.department
        } : null
      };
    });

    res.json({
      success: true,
      data: leavesWithUserDetails,
      count: leavesWithUserDetails.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getLeaveBalance,
  getPendingLeavesForApproval,
  approveLeave,
  rejectLeave,
  cancelMyLeave,
  getAllLeavesAdmin
};
