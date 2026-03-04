const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Update user (Admin only)
 */
async function updateUser(args) {
  try {
    const { userId, ...updateData } = args;
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field to update is required');
    }
    
    const result = await apiRequest(`/api/auth/users/${userId}`, 'PUT', updateData);
    
    return formatSuccess(result.data, 'User updated successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const updateUserTool = {
  name: 'update_user',
  description: 'Update user information. Only admins can update users. Can update name, email, role, department, managerId, etc.',
  inputSchema: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'The ID of the user to update'
      },
      name: {
        type: 'string',
        description: 'Updated name (optional)'
      },
      email: {
        type: 'string',
        description: 'Updated email (optional)'
      },
      role: {
        type: 'string',
        description: 'Updated role (optional)',
        enum: ['employee', 'manager', 'admin']
      },
      department: {
        type: 'string',
        description: 'Updated department (optional)'
      },
      managerId: {
        type: 'string',
        description: 'Updated manager ID (optional)'
      }
    },
    required: ['userId']
  }
};

module.exports = { updateUser, updateUserTool };
