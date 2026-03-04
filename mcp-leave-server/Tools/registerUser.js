const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Register new user tool (Admin only)
 */
async function registerUser(args) {
  try {
    const { employeeId, name, email, password, role, department, managerId } = args;
    
    if (!employeeId || !name || !email || !password) {
      throw new Error('Employee ID, name, email, and password are required');
    }
    
    const userData = {
      employeeId,
      name,
      email,
      password,
      role: role || 'employee',
      department,
      managerId: managerId ? parseInt(managerId) : null
    };
    
    const result = await apiRequest('/api/auth/register', 'POST', userData);
    
    return formatSuccess(result.data, 'User registered successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const registerUserTool = {
  name: 'register_user',
  description: 'Register a new user in the system. Only admins can register new users. Requires admin authentication.',
  inputSchema: {
    type: 'object',
    properties: {
      employeeId: {
        type: 'string',
        description: 'Unique employee ID (e.g., EMP001, EMP002)'
      },
      name: {
        type: 'string',
        description: 'Full name of the employee'
      },
      email: {
        type: 'string',
        description: 'Email address (must be unique)'
      },
      password: {
        type: 'string',
        description: 'Password for the user'
      },
      role: {
        type: 'string',
        description: 'User role: employee, manager, or admin (default: employee)',
        enum: ['employee', 'manager', 'admin']
      },
      department: {
        type: 'string',
        description: 'Department name (e.g., Engineering, HR, Marketing)'
      },
      managerId: {
        type: 'string',
        description: 'Manager user ID (optional, for employees)'
      }
    },
    required: ['employeeId', 'name', 'email', 'password']
  }
};

module.exports = { registerUser, registerUserTool };
