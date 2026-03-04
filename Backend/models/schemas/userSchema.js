const mongoose = require('mongoose');

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

const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.EMPLOYEE
  },
  department: {
    type: String,
    trim: true
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  leaveBalance: {
    casual: {
      type: Number,
      default: DEFAULT_LEAVE_BALANCE.casual
    },
    sick: {
      type: Number,
      default: DEFAULT_LEAVE_BALANCE.sick
    },
    annual: {
      type: Number,
      default: DEFAULT_LEAVE_BALANCE.annual
    },
    unpaid: {
      type: Number,
      default: DEFAULT_LEAVE_BALANCE.unpaid
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ managerId: 1 });

const User = mongoose.model('User', userSchema);

module.exports = { User, ROLES, DEFAULT_LEAVE_BALANCE };
