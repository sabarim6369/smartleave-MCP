const { apiRequest, formatSuccess, formatError } = require('../utils');
const config = require('../config');

/**
 * Login tool - Authenticate user and store session
 */
async function login(args) {
  try {
    const { email, password } = args;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Make login request (no auth required for login)
    const result = await apiRequest('/api/auth/login', 'POST', { email, password }, false);
    
    // Store token and user info in session
    config.setToken(result.data.token, result.data.user);
    
    return formatSuccess({
      user: result.data.user,
      message: 'Successfully logged in! You can now use other tools.'
    }, 'Login successful');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const loginTool = {
  name: 'login',
  description: 'Login to the SmartLeave system with email and password. This must be called before using any other tools that require authentication.',
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'User email address (e.g., admin@company.com, manager@company.com, employee@company.com)'
      },
      password: {
        type: 'string',
        description: 'User password'
      }
    },
    required: ['email', 'password']
  }
};

module.exports = { login, loginTool };
