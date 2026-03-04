# SmartLeave Backend API

A comprehensive Leave Management System backend built with Node.js and Express.js.

## Features

- ✅ User Authentication (Login/Register) with bcrypt password hashing
- ✅ Role-based Access Control (Admin, Manager, Employee)
- ✅ MongoDB Database with Mongoose ODM
- ✅ Leave Application Management
- ✅ Leave Balance Tracking
- ✅ Leave Approval/Rejection Workflow
- ✅ Multiple Leave Types (Casual, Sick, Annual, Unpaid)
- ✅ Manager Dashboard for Pending Leaves
- ✅ Admin Panel for User Management
- ✅ Persistent Data Storage with MongoDB
- ✅ Secure Password Hashing
- ✅ Environment-based Configuration

## Project Structure

```
Backend/
├── config/
│   └── database.js           # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication & User management
│   └── leaveController.js    # Leave management operations
├── models/
│   ├── schemas/
│   │   ├── userSchema.js     # Mongoose User schema
│   │   └── leaveSchema.js    # Mongoose Leave schema
│   ├── user.js               # User model with MongoDB operations
│   └── leave.js              # Leave model with MongoDB operations
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── leaveRoutes.js        # Leave management routes
├── middleware/
│   └── auth.js               # Authentication middleware
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── .gitignore                # Git ignore file
├── server.js                 # Application entry point
└── package.json              # Dependencies and scripts
```

## Installation

### Prerequisites

1. **MongoDB**: Install MongoDB locally or set up MongoDB Atlas
   - Local: Follow [MONGODB_SETUP.md](../MONGODB_SETUP.md) for detailed installation instructions
   - Cloud: Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Node.js**: Version 14 or higher

### Setup Steps

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```
This will install:
- express (^4.18.2) - Web framework
- cors (^2.8.5) - CORS middleware
- mongoose (^8.0.3) - MongoDB ODM
- bcryptjs (^2.4.3) - Password hashing
- dotenv (^16.3.1) - Environment variables

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update the MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/smartleave

# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartleave

PORT=3000
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000` and automatically:
- Connect to MongoDB
- Create database collections
- Initialize default users with hashed passwords

## Default Users

The system comes with three pre-configured users for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Manager | manager@company.com | manager123 |
| Employee | employee@company.com | employee123 |

## API Endpoints

### Authentication Endpoints

#### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "employee@company.com",
  "password": "employee123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 3,
      "employeeId": "EMP003",
      "name": "Employee User",
      "email": "employee@company.com",
      "role": "employee",
      "department": "Engineering"
    },
    "token": "mock_token_3"
  }
}
```

#### 2. Register New User (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "employeeId": "EMP004",
  "name": "John Doe",
  "email": "john@company.com",
  "password": "password123",
  "role": "employee",
  "department": "Marketing",
  "managerId": 2
}
```

#### 3. Get Current User Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### 4. Get All Users (Admin/Manager)
```http
GET /api/auth/users
Authorization: Bearer {admin_or_manager_token}
```

#### 5. Get User by ID (Admin/Manager)
```http
GET /api/auth/users/:id
Authorization: Bearer {admin_or_manager_token}
```

#### 6. Update User (Admin Only)
```http
PUT /api/auth/users/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "department": "New Department"
}
```

#### 7. Delete User (Admin Only)
```http
DELETE /api/auth/users/:id
Authorization: Bearer {admin_token}
```

### Leave Management Endpoints

#### 1. Apply for Leave
```http
POST /api/leaves/apply
Authorization: Bearer {token}
Content-Type: application/json

{
  "leaveType": "casual",
  "startDate": "2026-03-10",
  "endDate": "2026-03-12",
  "reason": "Personal work"
}
```

**Leave Types:**
- `casual` - Casual Leave (12 days/year)
- `sick` - Sick Leave (10 days/year)
- `annual` - Annual Leave (20 days/year)
- `unpaid` - Unpaid Leave (unlimited)

#### 2. Get My Leaves
```http
GET /api/leaves/my-leaves
Authorization: Bearer {token}

# Filter by status (optional)
GET /api/leaves/my-leaves?status=pending
```

**Status Options:** `pending`, `approved`, `rejected`, `cancelled`

#### 3. Get Leave Balance
```http
GET /api/leaves/balance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "balance": {
      "casual": {
        "total": 12,
        "used": 0,
        "available": 12
      },
      "sick": {
        "total": 10,
        "used": 0,
        "available": 10
      },
      "annual": {
        "total": 20,
        "used": 0,
        "available": 20
      }
    }
  }
}
```

#### 4. Cancel My Leave
```http
PATCH /api/leaves/cancel/:leaveId
Authorization: Bearer {token}
```

#### 5. Get Pending Leaves (Manager/Admin)
```http
GET /api/leaves/pending
Authorization: Bearer {manager_or_admin_token}
```

- Managers see pending leaves of their team members
- Admins see all pending leaves

#### 6. Approve Leave (Manager/Admin)
```http
PATCH /api/leaves/approve/:leaveId
Authorization: Bearer {manager_or_admin_token}
```

#### 7. Reject Leave (Manager/Admin)
```http
PATCH /api/leaves/reject/:leaveId
Authorization: Bearer {manager_or_admin_token}
Content-Type: application/json

{
  "reason": "Insufficient staffing during this period"
}
```

#### 8. Get All Leaves (Admin Only)
```http
GET /api/leaves/all
Authorization: Bearer {admin_token}

# Filter by status (optional)
GET /api/leaves/all?status=approved
```

## Leave Calculation Rules

1. **Working Days Only**: Leave days are calculated excluding weekends (Saturday & Sunday)
2. **Balance Validation**: System checks available balance before approving leave (except unpaid)
3. **Date Validation**: Start date cannot be in the past, end date must be after start date
4. **Annual Reset**: Leave balances reset at the start of each year

## User Roles & Permissions

### Employee
- Apply for leave
- View own leave history
- Check leave balance
- Cancel own pending/approved leaves

### Manager
- All employee permissions
- View pending leaves of team members
- Approve/reject team member leaves
- View all users

### Admin
- All manager permissions
- Add new users
- Update/delete users
- View all leaves in the system
- Approve/reject any leave

## Authorization

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

The token is received after successful login.

## Error Responses

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage Flow

### 1. Employee Applies for Leave
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@company.com","password":"employee123"}'

# Apply for leave
curl -X POST http://localhost:3000/api/leaves/apply \
  -H "Authorization: Bearer mock_token_3" \
  -H "Content-Type: application/json" \
  -d '{
    "leaveType":"casual",
    "startDate":"2026-03-15",
    "endDate":"2026-03-17",
    "reason":"Family function"
  }'
```

### 2. Manager Reviews and Approves
```bash
# Login as manager
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@company.com","password":"manager123"}'

# Get pending leaves
curl -X GET http://localhost:3000/api/leaves/pending \
  -H "Authorization: Bearer mock_token_2"

# Approve leave
curl -X PATCH http://localhost:3000/api/leaves/approve/1 \
  -H "Authorization: Bearer mock_token_2"
```

### 3. Admin Adds New Employee
```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"admin123"}'

# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer mock_token_1" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":"EMP005",
    "name":"Jane Smith",
    "email":"jane@company.com",
    "password":"password123",
    "role":"employee",
    "department":"HR",
    "managerId":2
  }'
```

## Development Notes

- ✅ **MongoDB Integration**: Uses MongoDB with Mongoose for persistent data storage
- ✅ **Password Security**: Implements bcrypt password hashing (10 salt rounds)
- ✅ **Environment Configuration**: Uses dotenv for environment variables (.env file)
- ✅ **Async Operations**: All database operations use async/await patterns
- 🔄 **JWT Authentication**: Currently uses session-based authentication (can be upgraded to JWT)
- 🔄 **Input Validation**: Basic validation implemented (can be enhanced with express-validator)

### Production Recommendations
- Implement JWT-based authentication for stateless API
- Add comprehensive input validation middleware
- Implement rate limiting for API endpoints
- Add logging system (Winston, Morgan)
- Enable HTTPS and secure headers (Helmet.js)
- Set up MongoDB indexes for query optimization
- Implement database backups and monitoring

## Future Enhancements

- [ ] JWT token-based authentication
- [ ] Email notifications for leave requests
- [ ] Leave calendar view
- [ ] Leave carry-forward rules
- [ ] Public holidays management
- [ ] Leave reports and analytics
- [ ] Multiple approver workflow
- [ ] Leave policy configuration
- [ ] Document attachments for leave requests
- [ ] Leave history and audit trail

## License

ISC
