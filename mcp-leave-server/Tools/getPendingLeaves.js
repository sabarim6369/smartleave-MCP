const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Get pending leaves for approval (Manager/Admin only)
 */
async function getPendingLeaves() {
  try {
    const result = await apiRequest('/api/leaves/pending', 'GET');
    
    return formatSuccess({
      pendingLeaves: result.data,
      count: result.count,
      message: `${result.count} leave application(s) pending approval`
    }, 'Pending leaves retrieved');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const getPendingLeavesTool = {
  name: 'get_pending_leaves',
  description: 'Get all pending leave applications that need approval. Managers see their team members\' leaves, admins see all pending leaves.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

module.exports = { getPendingLeaves, getPendingLeavesTool };
