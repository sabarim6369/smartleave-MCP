// Configuration for SmartLeave MCP Server
const config = {
  // Backend API URL
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  
  // Session storage for the current user's token
  session: {
    token: null,
    user: null
  },
  
  // Set the authentication token
  setToken(token, user) {
    this.session.token = token;
    this.session.user = user;
  },
  
  // Get the current token
  getToken() {
    return this.session.token;
  },
  
  // Get the current user
  getUser() {
    return this.session.user;
  },
  
  // Clear the session
  clearSession() {
    this.session.token = null;
    this.session.user = null;
  },
  
  // Check if user is logged in
  isLoggedIn() {
    return this.session.token !== null;
  }
};

module.exports = config;
