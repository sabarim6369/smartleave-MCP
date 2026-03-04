const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Get leave balance
 */
async function getLeaveBalance() {
  try {
    const result = await apiRequest('/api/leaves/balance', 'GET');
    
    return formatSuccess(result.data, 'Leave balance retrieved successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const getLeaveBalanceTool = {
  name: 'get_leave_balance',
  description: 'Get the leave balance for the logged-in user, showing total, used, and available days for each leave type (casual, sick, annual, unpaid).',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

module.exports = { getLeaveBalance, getLeaveBalanceTool };
