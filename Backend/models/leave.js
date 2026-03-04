const leaves = [];
let leaveId = 1;

// Leave types
const LEAVE_TYPES = {
  CASUAL: 'casual',
  SICK: 'sick',
  ANNUAL: 'annual',
  UNPAID: 'unpaid'
};

// Leave status
const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

class Leave {
  constructor(data) {
    this.id = leaveId++;
    this.userId = data.userId;
    this.leaveType = data.leaveType;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.days = data.days;
    this.reason = data.reason;
    this.status = LEAVE_STATUS.PENDING;
    this.appliedDate = new Date().toISOString();
    this.approvedBy = null;
    this.approvedDate = null;
    this.rejectionReason = null;
  }
}

// Create a leave application
const createLeave = (leaveData) => {
  const leave = new Leave(leaveData);
  leaves.push(leave);
  return leave;
};

// Get leave by ID
const getLeaveById = (id) => {
  return leaves.find(l => l.id === parseInt(id));
};

// Get leaves by user ID
const getLeavesByUserId = (userId) => {
  return leaves.filter(l => l.userId === parseInt(userId));
};

// Get all leaves
const getAllLeaves = () => {
  return leaves;
};

// Get pending leaves
const getPendingLeaves = () => {
  return leaves.filter(l => l.status === LEAVE_STATUS.PENDING);
};

// Get leaves by status
const getLeavesByStatus = (status) => {
  return leaves.filter(l => l.status === status);
};

// Get pending leaves for a manager (by team members)
const getPendingLeavesByManagerId = (managerId, teamMemberIds) => {
  return leaves.filter(l => 
    l.status === LEAVE_STATUS.PENDING && 
    teamMemberIds.includes(l.userId)
  );
};

// Update leave status
const updateLeaveStatus = (leaveId, status, approvedBy, rejectionReason = null) => {
  const leave = getLeaveById(leaveId);
  if (!leave) {
    throw new Error('Leave not found');
  }

  leave.status = status;
  
  if (status === LEAVE_STATUS.APPROVED || status === LEAVE_STATUS.REJECTED) {
    leave.approvedBy = approvedBy;
    leave.approvedDate = new Date().toISOString();
  }

  if (status === LEAVE_STATUS.REJECTED && rejectionReason) {
    leave.rejectionReason = rejectionReason;
  }

  return leave;
};

// Cancel leave
const cancelLeave = (leaveId, userId) => {
  const leave = getLeaveById(leaveId);
  if (!leave) {
    throw new Error('Leave not found');
  }

  if (leave.userId !== parseInt(userId)) {
    throw new Error('Unauthorized to cancel this leave');
  }

  if (leave.status !== LEAVE_STATUS.PENDING && leave.status !== LEAVE_STATUS.APPROVED) {
    throw new Error('Cannot cancel leave with status: ' + leave.status);
  }

  leave.status = LEAVE_STATUS.CANCELLED;
  return leave;
};

// Get leaves by date range
const getLeavesByDateRange = (startDate, endDate) => {
  return leaves.filter(l => {
    const leaveStart = new Date(l.startDate);
    const leaveEnd = new Date(l.endDate);
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    return (leaveStart <= rangeEnd && leaveEnd >= rangeStart);
  });
};

// Get approved leaves for a user by year
const getApprovedLeavesByYear = (userId, year) => {
  return leaves.filter(l => {
    if (l.userId !== parseInt(userId)) return false;
    if (l.status !== LEAVE_STATUS.APPROVED) return false;
    
    const leaveYear = new Date(l.startDate).getFullYear();
    return leaveYear === parseInt(year);
  });
};

// Calculate used leave days by type and year
const getUsedLeaveDays = (userId, leaveType, year) => {
  const approvedLeaves = leaves.filter(l => {
    if (l.userId !== parseInt(userId)) return false;
    if (l.status !== LEAVE_STATUS.APPROVED) return false;
    if (l.leaveType !== leaveType) return false;
    
    const leaveYear = new Date(l.startDate).getFullYear();
    return leaveYear === parseInt(year);
  });

  return approvedLeaves.reduce((total, leave) => total + leave.days, 0);
};

// Delete leave
const deleteLeave = (id) => {
  const leaveIndex = leaves.findIndex(l => l.id === parseInt(id));
  if (leaveIndex === -1) {
    throw new Error('Leave not found');
  }

  const deletedLeave = leaves.splice(leaveIndex, 1)[0];
  return deletedLeave;
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
