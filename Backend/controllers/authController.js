const {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  ROLES
} = require('../models/user');

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password using bcrypt
    const { verifyPassword } = require('../models/user');
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Don't send password in response
    const userObj = user.toObject ? user.toObject() : user;
    const { password: _, ...userWithoutPassword } = userObj;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token: `mock_token_${user._id}` // In production, use JWT
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Register (for admin to add new users)
const register = async (req, res) => {
  try {
    const { employeeId, name, email, password, role, department, managerId } = req.body;

    if (!employeeId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, name, email, and password are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate role
    if (role && !Object.values(ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await createUser({
      employeeId,
      name,
      email,
      password,
      role,
      department,
      managerId
    });

    // Don't send password in response
    const userObj = user.toObject ? user.toObject() : user;
    const { password: _, ...userWithoutPassword } = userObj;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // This would come from auth middleware

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // User already comes without password from findUserById
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    
    // Users already come without passwords from getAllUsers
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user by ID (admin/manager only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // User already comes without password from findUserById
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user (admin only)
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await updateUser(id, updates);

    // User already comes without password from updateUser
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user (admin only)
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUser(id);

    // User already comes without password from deleteUser
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
