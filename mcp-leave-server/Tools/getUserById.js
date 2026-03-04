const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Get user by ID
 */
async function getUserById(args) {
  try {
    const { userId } = args;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const result = await apiRequest(`/api/auth/users/${userId}`, 'GET');
    
    return formatSuccess(result.data, 'User retrieved successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const getUserByIdTool = {
  name: 'get_user_by_id',
  description: 'Get detailed information about a specific user by their ID. Available to managers and admins.',
  inputSchema: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'The ID of the user to retrieve'
      }
    },
    required: ['userId']
  }
};

module.exports = { getUserById, getUserByIdTool };
