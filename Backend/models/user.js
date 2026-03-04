const bcrypt = require('bcryptjs');
const { User, ROLES, DEFAULT_LEAVE_BALANCE } = require('./schemas/userSchema');

// Create a user
const createUser = async (userData) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Check if employeeId already exists
    const existingEmployeeId = await User.findOne({ employeeId: userData.employeeId });
    if (existingEmployeeId) {
      throw new Error('Employee ID already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create new user with hashed password
    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Find user by ID
const findUserById = async (id) => {
  try {
    return await User.findById(id).select('-password');
  } catch (error) {
    return null;
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    return null;
  }
};

// Find user by employee ID
const findUserByEmployeeId = async (employeeId) => {
  try {
    return await User.findOne({ employeeId }).select('-password');
  } catch (error) {
    return null;
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    return await User.find().select('-password').sort({ createdAt: -1 });
  } catch (error) {
    return [];
  }
};

// Update user
const updateUser = async (id, updates) => {
  try {
    // Prevent updating certain fields
    const { _id, password, createdAt, ...allowedUpdates } = updates;
    
    // If password is being updated, hash it
    if (updates.password) {
      allowedUpdates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Update leave balance
const updateLeaveBalance = async (userId, leaveType, amount) => {
  try {
    const updateField = `leaveBalance.${leaveType}`;
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { [updateField]: amount } },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Get users by manager ID
const getUsersByManagerId = async (managerId) => {
  try {
    return await User.find({ managerId }).select('-password');
  } catch (error) {
    return [];
  }
};

// Delete user
const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Verify password
const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Initialize with some default users (for testing)
const initializeDefaultUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Initializing default users...');
      
      // Admin user
      await createUser({
        employeeId: 'EMP001',
        name: 'Admin User',
        email: 'admin@company.com',
        password: 'admin123',
        role: ROLES.ADMIN,
        department: 'Management'
      });

      // Manager user
      const manager = await createUser({
        employeeId: 'EMP002',
        name: 'Manager User',
        email: 'manager@company.com',
        password: 'manager123',
        role: ROLES.MANAGER,
        department: 'Engineering'
      });

      // Employee user
      await createUser({
        employeeId: 'EMP003',
        name: 'Employee User',
        email: 'employee@company.com',
        password: 'employee123',
        role: ROLES.EMPLOYEE,
        department: 'Engineering',
        managerId: manager._id
      });

      console.log('Default users created successfully');
    }
  } catch (error) {
    console.error('Error initializing default users:', error.message);
  }
};

module.exports = {
  ROLES,
  DEFAULT_LEAVE_BALANCE,
  createUser,
  findUserById,
  findUserByEmail,
  findUserByEmployeeId,
  getAllUsers,
  updateUser,
  updateLeaveBalance,
  getUsersByManagerId,
  deleteUser,
  verifyPassword,
  initializeDefaultUsers
};
