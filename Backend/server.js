const express = require('express');
const cors = require('cors');
const { initializeDefaultUsers } = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize default users
initializeDefaultUsers();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SmartLeave API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to SmartLeave API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register (Admin only)',
        profile: 'GET /api/auth/profile',
        users: 'GET /api/auth/users (Admin/Manager)',
        userById: 'GET /api/auth/users/:id (Admin/Manager)',
        updateUser: 'PUT /api/auth/users/:id (Admin)',
        deleteUser: 'DELETE /api/auth/users/:id (Admin)'
      },
      leaves: {
        apply: 'POST /api/leaves/apply',
        myLeaves: 'GET /api/leaves/my-leaves',
        balance: 'GET /api/leaves/balance',
        cancel: 'PATCH /api/leaves/cancel/:leaveId',
        pending: 'GET /api/leaves/pending (Manager/Admin)',
        approve: 'PATCH /api/leaves/approve/:leaveId (Manager/Admin)',
        reject: 'PATCH /api/leaves/reject/:leaveId (Manager/Admin)',
        all: 'GET /api/leaves/all (Admin)'
      }
    },
    defaultUsers: {
      admin: {
        email: 'admin@company.com',
        password: 'admin123',
        role: 'admin'
      },
      manager: {
        email: 'manager@company.com',
        password: 'manager123',
        role: 'manager'
      },
      employee: {
        email: 'employee@company.com',
        password: 'employee123',
        role: 'employee'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`SmartLeave API Server`);
  console.log('='.repeat(50));
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
  console.log(`\nDefault Users:`);
  console.log(`  Admin    : admin@company.com / admin123`);
  console.log(`  Manager  : manager@company.com / manager123`);
  console.log(`  Employee : employee@company.com / employee123`);
  console.log('='.repeat(50));
  console.log(`\nAPI Documentation: http://localhost:${PORT}/`);
  console.log('='.repeat(50));
});

module.exports = app;
