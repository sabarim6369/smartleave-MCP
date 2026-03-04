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
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // In production, use bcrypt to compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token: `mock_token_${user.id}` // In production, use JWT
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
const register = (req, res) => {
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

    const user = createUser({
      employeeId,
      name,
      email,
      password, // In production, hash this with bcrypt
      role,
      department,
      managerId
    });

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

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
const getProfile = (req, res) => {
  try {
    const userId = req.userId; // This would come from auth middleware

    const user = findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (admin only)
const getUsers = (req, res) => {
  try {
    const users = getAllUsers();
    
    // Don't send passwords in response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    res.json({
      success: true,
      data: usersWithoutPasswords,
      count: usersWithoutPasswords.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user by ID (admin/manager only)
const getUserById = (req, res) => {
  try {
    const { id } = req.params;

    const user = findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user (admin only)
const updateUserById = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If password is being updated, hash it (in production)
    if (updates.password) {
      // In production: updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = updateUser(id, updates);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user (admin only)
const deleteUserById = (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = deleteUser(id);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = deletedUser;

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: userWithoutPassword
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
