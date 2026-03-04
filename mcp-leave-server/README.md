# SmartLeave MCP Server

A Model Context Protocol (MCP) server for the SmartLeave Leave Management System. This server enables Claude Desktop to interact with the SmartLeave backend through tool calling.

## Features

This MCP server provides **16 tools** covering all aspects of leave management:

### 🔐 Authentication Tools (8 tools)
- **login** - Login with email and password
- **logout** - Logout and clear session
- **get_profile** - Get current user profile
- **register_user** - Add new user (Admin only)
- **get_users** - List all users (Admin/Manager)
- **get_user_by_id** - Get user details by ID
- **update_user** - Update user information (Admin only)
- **delete_user** - Delete user (Admin only)

### 📝 Leave Management Tools (8 tools)
- **apply_leave** - Apply for leave
- **get_my_leaves** - View your leave history
- **get_leave_balance** - Check available leave balance
- **cancel_leave** - Cancel your own leave
- **get_pending_leaves** - View pending approvals (Manager/Admin)
- **approve_leave** - Approve leave requests (Manager/Admin)
- **reject_leave** - Reject leave requests (Manager/Admin)
- **get_all_leaves** - View all leaves in system (Admin only)

## Prerequisites

1. **Node.js** installed (v16 or higher)
2. **SmartLeave Backend** running on `http://localhost:3000`
3. **Claude Desktop** application installed

## Installation

### 1. Install Dependencies

Navigate to the mcp-leave-server directory and install dependencies:

```bash
cd mcp-leave-server
npm install
```

### 2. Configure Claude Desktop

Add the MCP server to your Claude Desktop configuration:

#### On Windows:
Edit `%APPDATA%\Claude\claude_desktop_config.json`

#### On macOS:
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "smartleave": {
      "command": "node",
      "args": [
        "C:\\Users\\sabar\\Documents\\Projects\\SmartLeave MCP\\mcp-leave-server\\server.js"
      ]
    }
  }
}
```

**Important:** Update the path to match your actual installation directory.

### 3. Start the Backend Server

Make sure the SmartLeave backend is running:

```bash
cd Backend
npm install
npm start
```

The backend should be running on `http://localhost:3000`

### 4. Restart Claude Desktop

Close and restart Claude Desktop for the configuration to take effect.

## Usage

### Initial Login

Before using any other tools, you must login:

```
Please login with email: employee@company.com and password: employee123
```

Claude will use the `login` tool automatically.

### Example Workflows

#### 1. Apply for Leave as Employee

```
I need to apply for casual leave from March 10 to March 12, 2026 for personal work
```

Claude will:
1. Use `login` tool if not logged in
2. Use `apply_leave` tool with the details
3. Show the leave application confirmation

#### 2. Check Leave Balance

```
What's my current leave balance?
```

Claude will use `get_leave_balance` tool to show available leaves.

#### 3. View Leave History

```
Show me all my leave applications
```

Claude will use `get_my_leaves` tool to display your leave history.

#### 4. Manager Approving Leaves

```
Login as manager (manager@company.com, manager123) and show me pending leaves
```

Claude will:
1. Use `login` tool with manager credentials
2. Use `get_pending_leaves` to show pending approvals
3. You can then ask to approve specific leaves

#### 5. Admin Adding New User

```
Login as admin and add a new employee: John Doe, email john@company.com, employee ID EMP005, department Marketing
```

Claude will:
1. Use `login` with admin credentials
2. Use `register_user` to create the new user

## Default Test Users

| Role | Email | Password |
|------|-------|----------|
| Employee | employee@company.com | employee123 |
| Manager | manager@company.com | manager123 |
| Admin | admin@company.com | admin123 |

## Available Tools Reference

### Authentication Tools

#### 1. login
```javascript
{
  email: "employee@company.com",
  password: "employee123"
}
```

#### 2. get_profile
No parameters required. Returns current user's profile.

#### 3. register_user (Admin only)
```javascript
{
  employeeId: "EMP005",
  name: "John Doe",
  email: "john@company.com",
  password: "password123",
  role: "employee", // optional: employee, manager, admin
  department: "Marketing",
  managerId: "2" // optional
}
```

#### 4. get_users (Admin/Manager)
No parameters required. Returns all users.

#### 5. get_user_by_id (Admin/Manager)
```javascript
{
  userId: "3"
}
```

#### 6. update_user (Admin only)
```javascript
{
  userId: "3",
  name: "Updated Name", // optional
  department: "New Department", // optional
  role: "manager" // optional
}
```

#### 7. delete_user (Admin only)
```javascript
{
  userId: "5"
}
```

#### 8. logout
No parameters required. Clears current session.

### Leave Management Tools

#### 1. apply_leave
```javascript
{
  leaveType: "casual", // casual, sick, annual, unpaid
  startDate: "2026-03-10", // YYYY-MM-DD
  endDate: "2026-03-12",
  reason: "Personal work"
}
```

#### 2. get_my_leaves
```javascript
{
  status: "pending" // optional: pending, approved, rejected, cancelled
}
```

#### 3. get_leave_balance
No parameters required. Returns leave balance for all types.

#### 4. cancel_leave
```javascript
{
  leaveId: "1"
}
```

#### 5. get_pending_leaves (Manager/Admin)
No parameters required. Returns pending leaves for approval.

#### 6. approve_leave (Manager/Admin)
```javascript
{
  leaveId: "1"
}
```

#### 7. reject_leave (Manager/Admin)
```javascript
{
  leaveId: "1",
  reason: "Insufficient staffing during this period"
}
```

#### 8. get_all_leaves (Admin only)
```javascript
{
  status: "approved" // optional: pending, approved, rejected, cancelled
}
```

## Leave Types and Balances

Each user gets the following annual leave allocation:

| Leave Type | Days per Year |
|------------|---------------|
| Casual | 12 days |
| Sick | 10 days |
| Annual | 20 days |
| Unpaid | Unlimited |

## Troubleshooting

### MCP Server Not Showing in Claude Desktop

1. **Check configuration path**: Ensure the path in `claude_desktop_config.json` is correct
2. **Restart Claude Desktop**: Close completely and reopen
3. **Check logs**: Look at Claude Desktop's developer console for errors
4. **Verify Node.js**: Run `node --version` to ensure Node.js is installed

### Backend Connection Error

1. **Start Backend**: Make sure the backend server is running on port 3000
2. **Check URL**: Verify `config.js` has the correct `apiUrl`
3. **Test Backend**: Visit `http://localhost:3000` in a browser

### Authentication Errors

1. **Login First**: Make sure to login before using protected tools
2. **Check Credentials**: Verify email and password are correct
3. **Session Expired**: Logout and login again if session expires

### Permission Denied Errors

- **Employee** can only manage their own leaves
- **Manager** can approve/reject team member leaves
- **Admin** has full access to all features

## Project Structure

```
mcp-leave-server/
├── Tools/
│   ├── login.js              # Login tool
│   ├── logout.js             # Logout tool
│   ├── getProfile.js         # Get profile tool
│   ├── registerUser.js       # Register user tool
│   ├── getUsers.js           # Get all users tool
│   ├── getUserById.js        # Get user by ID tool
│   ├── updateUser.js         # Update user tool
│   ├── deleteUser.js         # Delete user tool
│   ├── applyLeave.js         # Apply leave tool
│   ├── getMyLeaves.js        # Get my leaves tool
│   ├── getLeaveBalance.js    # Get leave balance tool
│   ├── getPendingLeaves.js   # Get pending leaves tool
│   ├── approveLeave.js       # Approve leave tool
│   ├── rejectLeave.js        # Reject leave tool
│   ├── cancelLeave.js        # Cancel leave tool
│   └── getAllLeaves.js       # Get all leaves tool
├── config.js                 # Configuration and session management
├── utils.js                  # Utility functions for API calls
├── server.js                 # Main MCP server
├── package.json
└── README.md
```

## Development

### Testing Tools Manually

You can test the backend API directly using curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@company.com","password":"employee123"}'

# Apply leave (use token from login)
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

### Modifying Tools

To add or modify tools:

1. Create/edit tool file in `Tools/` directory
2. Export the handler function and tool definition
3. Import and register in `server.js`
4. Restart the MCP server (restart Claude Desktop)

### Changing Backend URL

Edit `config.js` to change the backend URL:

```javascript
apiUrl: process.env.API_URL || 'http://localhost:3000'
```

Or set environment variable:
```bash
export API_URL=http://your-backend-url:port
```

## API Response Format

All tools return responses in JSON format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* result data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Security Notes

⚠️ **Important**: This is a development/demo version with mock authentication. For production:

- Implement proper JWT token validation
- Add token expiration and refresh
- Use environment variables for sensitive data
- Implement rate limiting
- Add request validation
- Use HTTPS for API communication
- Hash passwords with bcrypt

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify backend is running correctly
3. Check Claude Desktop logs
4. Review backend API documentation

---

**Ready to use!** Start Claude Desktop and begin managing leaves with natural language commands! 🎉
