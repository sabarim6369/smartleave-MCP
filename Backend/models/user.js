const users = [];
let userId = 1;

// User roles
const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

// Leave balances per year
const DEFAULT_LEAVE_BALANCE = {
  casual: 12,
  sick: 10,
  annual: 20,
  unpaid: 0
};

class User {
  constructor(data) {
    this.id = userId++;
    this.employeeId = data.employeeId;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password; // In production, this should be hashed
    this.role = data.role || ROLES.EMPLOYEE;
    this.department = data.department;
    this.managerId = data.managerId || null;
    this.joinDate = data.joinDate || new Date().toISOString();
    this.leaveBalance = { ...DEFAULT_LEAVE_BALANCE };
    this.createdAt = new Date().toISOString();
  }
}

// Create a user
const createUser = (userData) => {
  // Check if email already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Check if employeeId already exists
  const existingEmployeeId = users.find(u => u.employeeId === userData.employeeId);
  if (existingEmployeeId) {
    throw new Error('Employee ID already exists');
  }

  const user = new User(userData);
  users.push(user);
  return user;
};

// Find user by ID
const findUserById = (id) => {
  return users.find(u => u.id === parseInt(id));
};

// Find user by email
const findUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

// Find user by employee ID
const findUserByEmployeeId = (employeeId) => {
  return users.find(u => u.employeeId === employeeId);
};

// Get all users
const getAllUsers = () => {
  return users;
};

// Update user
const updateUser = (id, updates) => {
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Prevent updating certain fields
  const { id: _, createdAt, ...allowedUpdates } = updates;
  users[userIndex] = { ...users[userIndex], ...allowedUpdates };
  return users[userIndex];
};

// Update leave balance
const updateLeaveBalance = (userId, leaveType, amount) => {
  const user = findUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.leaveBalance[leaveType] = (user.leaveBalance[leaveType] || 0) + amount;
  return user;
};

// Get users by manager ID
const getUsersByManagerId = (managerId) => {
  return users.filter(u => u.managerId === parseInt(managerId));
};

// Delete user
const deleteUser = (id) => {
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  return deletedUser;
};

// Initialize with some default users (for testing)
const initializeDefaultUsers = () => {
  if (users.length === 0) {
    // Admin user
    createUser({
      employeeId: 'EMP001',
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'admin123',
      role: ROLES.ADMIN,
      department: 'Management'
    });

    // Manager user
    createUser({
      employeeId: 'EMP002',
      name: 'Manager User',
      email: 'manager@company.com',
      password: 'manager123',
      role: ROLES.MANAGER,
      department: 'Engineering'
    });

    // Employee user
    createUser({
      employeeId: 'EMP003',
      name: 'Employee User',
      email: 'employee@company.com',
      password: 'employee123',
      role: ROLES.EMPLOYEE,
      department: 'Engineering',
      managerId: 2
    });
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
  initializeDefaultUsers
};
