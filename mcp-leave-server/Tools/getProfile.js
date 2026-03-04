const config = require('../config');
const { formatSuccess, formatError } = require('../utils');

/**
 * Get current user profile
 */
async function getProfile() {
  try {
    const user = config.getUser();
    
    if (!user) {
      throw new Error('Not logged in. Please use the login tool first.');
    }
    
    return formatSuccess({
      user,
      message: 'Current user profile retrieved successfully'
    }, 'Profile retrieved');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const getProfileTool = {
  name: 'get_profile',
  description: 'Get the currently logged-in user\'s profile information including role, department, and leave balance.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

module.exports = { getProfile, getProfileTool };
