const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Delete user (Admin only)
 */
async function deleteUser(args) {
  try {
    const { userId } = args;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const result = await apiRequest(`/api/auth/users/${userId}`, 'DELETE');
    
    return formatSuccess(result.data, 'User deleted successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const deleteUserTool = {
  name: 'delete_user',
  description: 'Delete a user from the system. Only admins can delete users. This action cannot be undone.',
  inputSchema: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'The ID of the user to delete'
      }
    },
    required: ['userId']
  }
};

module.exports = { deleteUser, deleteUserTool };
