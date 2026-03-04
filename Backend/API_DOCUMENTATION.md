# SmartLeave Backend API

A comprehensive Leave Management System backend built with Node.js and Express.js.

## Features

- ✅ User Authentication (Login/Register)
- ✅ Role-based Access Control (Admin, Manager, Employee)
- ✅ Leave Application Management
- ✅ Leave Balance Tracking
- ✅ Leave Approval/Rejection Workflow
- ✅ Multiple Leave Types (Casual, Sick, Annual, Unpaid)
- ✅ Manager Dashboard for Pending Leaves
- ✅ Admin Panel for User Management

## Project Structure

```
Backend/
├── controllers/
│   ├── authController.js      # Authentication & User management
│   └── leaveController.js     # Leave management operations
├── models/
│   ├── user.js               # User data model
│   └── leave.js              # Leave data model
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── leaveRoutes.js        # Leave management routes
├── middleware/
│   └── auth.js               # Authentication middleware
├── server.js                 # Application entry point
└── package.json

```

## Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

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

- This is a development version using in-memory data storage
- For production, integrate a proper database (MongoDB, PostgreSQL, etc.)
- Implement proper JWT-based authentication
- Add password hashing with bcrypt
- Add input validation middleware
- Implement rate limiting
- Add logging system
- Set up environment variables (.env file)

## Future Enhancements

- [ ] Database integration
- [ ] JWT authentication
- [ ] Email notifications
- [ ] Leave calendar view
- [ ] Leave carry-forward rules
- [ ] Public holidays management
- [ ] Leave reports and analytics
- [ ] Multiple approver workflow
- [ ] Leave policy configuration

## License

ISC
