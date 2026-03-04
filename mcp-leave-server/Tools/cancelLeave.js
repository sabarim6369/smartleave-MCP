const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Cancel a leave application
 */
async function cancelLeave(args) {
  try {
    const { leaveId } = args;
    
    if (!leaveId) {
      throw new Error('Leave ID is required');
    }
    
    const result = await apiRequest(`/api/leaves/cancel/${leaveId}`, 'PATCH');
    
    return formatSuccess(result.data, 'Leave cancelled successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const cancelLeaveTool = {
  name: 'cancel_leave',
  description: 'Cancel your own leave application. Can only cancel leaves that are in pending or approved status.',
  inputSchema: {
    type: 'object',
    properties: {
      leaveId: {
        type: 'string',
        description: 'The ID of the leave application to cancel'
      }
    },
    required: ['leaveId']
  }
};

module.exports = { cancelLeave, cancelLeaveTool };
