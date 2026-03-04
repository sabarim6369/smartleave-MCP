const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Get all users (Admin/Manager only)
 */
async function getUsers() {
  try {
    const result = await apiRequest('/api/auth/users', 'GET');
    
    return formatSuccess({
      users: result.data,
      count: result.count,
      message: `Retrieved ${result.count} users successfully`
    }, 'Users retrieved');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const getUsersTool = {
  name: 'get_users',
  description: 'Get a list of all users in the system. Available to managers and admins only.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

module.exports = { getUsers, getUsersTool };
