const { findUserById } = require('../models/user');

// Mock authentication middleware
// In production, use JWT and verify tokens properly
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Mock token verification - extract user ID
    // In production, use jwt.verify()
    const userId = token.replace('mock_token_', '');
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user info to request
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based access control middleware
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  requireRole
};
