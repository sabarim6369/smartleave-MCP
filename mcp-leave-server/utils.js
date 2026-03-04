const config = require('./config');

/**
 * Make an API request to the backend
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {object} data - Request body data
 * @param {boolean} requireAuth - Whether authentication is required
 * @returns {Promise<object>} - API response
 */
async function apiRequest(endpoint, method = 'GET', data = null, requireAuth = true) {
  const url = `${config.apiUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Add authorization header if required and token is available
  if (requireAuth) {
    const token = config.getToken();
    if (!token) {
      throw new Error('Not authenticated. Please login first using the login tool.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || `Request failed with status ${response.status}`);
    }
    
    return result;
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
}

/**
 * Format a successful response for MCP
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @returns {object} - Formatted response
 */
function formatSuccess(data, message = null) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: message || 'Operation completed successfully',
          data
        }, null, 2)
      }
    ]
  };
}

/**
 * Format an error response for MCP
 * @param {string} error - Error message
 * @returns {object} - Formatted error response
 */
function formatError(error) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : error
        }, null, 2)
      }
    ],
    isError: true
  };
}

module.exports = {
  apiRequest,
  formatSuccess,
  formatError
};
