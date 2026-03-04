const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Get all leaves (Admin only)
 */
async function getAllLeaves(args) {
  try {
    const { status } = args || {};
    
    let endpoint = '/api/leaves/all';
    if (status) {
      endpoint += `?status=${status}`;
    }
    
    const result = await apiRequest(endpoint, 'GET');
    
    return formatSuccess({
      leaves: result.data,
      count: result.count,
      message: `Retrieved ${result.count} leave application(s)`
    }, 'All leaves retrieved');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const getAllLeavesTool = {
  name: 'get_all_leaves',
  description: 'Get all leave applications in the system with user details. Admin only. Can optionally filter by status.',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        description: 'Filter by leave status (optional)',
        enum: ['pending', 'approved', 'rejected', 'cancelled']
      }
    },
    required: []
  }
};

module.exports = { getAllLeaves, getAllLeavesTool };
