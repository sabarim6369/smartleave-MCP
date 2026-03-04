const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Approve a leave application (Manager/Admin only)
 */
async function approveLeave(args) {
  try {
    const { leaveId } = args;
    
    if (!leaveId) {
      throw new Error('Leave ID is required');
    }
    
    const result = await apiRequest(`/api/leaves/approve/${leaveId}`, 'PATCH');
    
    return formatSuccess(result.data, 'Leave approved successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const approveLeaveTool = {
  name: 'approve_leave',
  description: 'Approve a pending leave application. Available to managers (for their team) and admins (for all leaves).',
  inputSchema: {
    type: 'object',
    properties: {
      leaveId: {
        type: 'string',
        description: 'The ID of the leave application to approve'
      }
    },
    required: ['leaveId']
  }
};

module.exports = { approveLeave, approveLeaveTool };
