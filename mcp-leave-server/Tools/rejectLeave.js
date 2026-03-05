const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Reject a leave application (Manager/Admin only)
 */
async function rejectLeave(args) {
  try {
    const { leaveId, reason } = args;
    
    if (!leaveId) {
      throw new Error('Leave ID is required');
      
    }
    
    if (!reason) {
      throw new Error('Rejection reason is required');
    }
    
    const result = await apiRequest(`/api/leaves/reject/${leaveId}`, 'PATCH', { reason });
    
    return formatSuccess(result.data, 'Leave rejected successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const rejectLeaveTool = {
  name: 'reject_leave',
  description: 'Reject a pending leave application with a reason. Available to managers (for their team) and admins (for all leaves).',
  inputSchema: {
    type: 'object',
    properties: {
      leaveId: {
        type: 'string',
        description: 'The ID of the leave application to reject'
      },
      reason: {
        type: 'string',
        description: 'Reason for rejecting the leave application'
      }
    },
    required: ['leaveId', 'reason']
  }
};

module.exports = { rejectLeave, rejectLeaveTool };
