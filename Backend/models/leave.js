const { Leave, LEAVE_TYPES, LEAVE_STATUS } = require('./schemas/leaveSchema');

// Create a leave application
const createLeave = async (leaveData) => {
  try {
    const leave = new Leave(leaveData);
    await leave.save();
    return leave;
  } catch (error) {
    throw error;
  }
};

// Get leave by ID
const getLeaveById = async (id) => {
  try {
    return await Leave.findById(id).populate('userId', 'name email employeeId department');
  } catch (error) {
    return null;
  }
};

// Get leaves by user ID
const getLeavesByUserId = async (userId) => {
  try {
    return await Leave.find({ userId }).sort({ appliedDate: -1 });
  } catch (error) {
    return [];
  }
};

// Get all leaves
const getAllLeaves = async () => {
  try {
    return await Leave.find()
      .populate('userId', 'name email employeeId department')
      .sort({ appliedDate: -1 });
  } catch (error) {
    return [];
  }
};

// Get pending leaves
const getPendingLeaves = async () => {
  try {
    return await Leave.find({ status: LEAVE_STATUS.PENDING })
      .populate('userId', 'name email employeeId department')
      .sort({ appliedDate: -1 });
  } catch (error) {
    return [];
  }
};

// Get leaves by status
const getLeavesByStatus = async (status) => {
  try {
    return await Leave.find({ status })
      .populate('userId', 'name email employeeId department')
      .sort({ appliedDate: -1 });
  } catch (error) {
    return [];
  }
};

// Get pending leaves for a manager (by team members)
const getPendingLeavesByManagerId = async (managerId, teamMemberIds) => {
  try {
    return await Leave.find({
      status: LEAVE_STATUS.PENDING,
      userId: { $in: teamMemberIds }
    })
      .populate('userId', 'name email employeeId department')
      .sort({ appliedDate: -1 });
  } catch (error) {
    return [];
  }
};

// Update leave status
const updateLeaveStatus = async (leaveId, status, approvedBy, rejectionReason = null) => {
  try {
    const updateData = {
      status
    };

    if (status === LEAVE_STATUS.APPROVED || status === LEAVE_STATUS.REJECTED) {
      updateData.approvedBy = approvedBy;
      updateData.approvedDate = new Date();
    }

    if (status === LEAVE_STATUS.REJECTED && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { $set: updateData },
      { new: true }
    ).populate('userId', 'name email employeeId department');

    if (!leave) {
      throw new Error('Leave not found');
    }

    return leave;
  } catch (error) {
    throw error;
  }
};

// Cancel leave
const cancelLeave = async (leaveId, userId) => {
  try {
    const leave = await Leave.findById(leaveId);
    
    if (!leave) {
      throw new Error('Leave not found');
    }

    if (leave.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized to cancel this leave');
    }

    if (leave.status !== LEAVE_STATUS.PENDING && leave.status !== LEAVE_STATUS.APPROVED) {
      throw new Error('Cannot cancel leave with status: ' + leave.status);
    }

    leave.status = LEAVE_STATUS.CANCELLED;
    await leave.save();
    
    return leave;
  } catch (error) {
    throw error;
  }
};

// Get leaves by date range
const getLeavesByDateRange = async (startDate, endDate) => {
  try {
    return await Leave.find({
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    })
      .populate('userId', 'name email employeeId department')
      .sort({ startDate: 1 });
  } catch (error) {
    return [];
  }
};

// Get approved leaves for a user by year
const getApprovedLeavesByYear = async (userId, year) => {
  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    return await Leave.find({
      userId,
      status: LEAVE_STATUS.APPROVED,
      startDate: { $gte: startOfYear, $lte: endOfYear }
    });
  } catch (error) {
    return [];
  }
};

// Calculate used leave days by type and year
const getUsedLeaveDays = async (userId, leaveType, year) => {
  try {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const approvedLeaves = await Leave.find({
      userId,
      leaveType,
      status: LEAVE_STATUS.APPROVED,
      startDate: { $gte: startOfYear, $lte: endOfYear }
    });

    return approvedLeaves.reduce((total, leave) => total + leave.days, 0);
  } catch (error) {
    return 0;
  }
};

// Delete leave
const deleteLeave = async (id) => {
  try {
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) {
      throw new Error('Leave not found');
    }
    return leave;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  LEAVE_TYPES,
  LEAVE_STATUS,
  createLeave,
  getLeaveById,
  getLeavesByUserId,
  getAllLeaves,
  getPendingLeaves,
  getLeavesByStatus,
  getPendingLeavesByManagerId,
  updateLeaveStatus,
  cancelLeave,
  getLeavesByDateRange,
  getApprovedLeavesByYear,
  getUsedLeaveDays,
  deleteLeave
};
