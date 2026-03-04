const config = require('../config');
const { formatSuccess } = require('../utils');

/**
 * Logout and clear session
 */
async function logout() {
  const user = config.getUser();
  config.clearSession();
  
  return formatSuccess({
    message: user ? `${user.name} logged out successfully` : 'Logged out successfully'
  }, 'Logout successful');
}

// Tool definition for MCP
const logoutTool = {
  name: 'logout',
  description: 'Logout from the current session and clear authentication token.',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

module.exports = { logout, logoutTool };
