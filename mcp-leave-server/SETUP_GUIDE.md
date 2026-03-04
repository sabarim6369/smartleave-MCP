# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Start Backend Server

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Start the server
npm start
```

You should see:
```
SmartLeave API Server
Server is running on http://localhost:3000
```

### 2. Install MCP Server Dependencies

```bash
# Navigate to MCP server directory
cd mcp-leave-server

# Install dependencies
npm install
```

### 3. Configure Claude Desktop

#### Windows Users:
1. Press `Win + R` and type: `%APPDATA%\Claude`
2. Open or create `claude_desktop_config.json`
3. Add the following (update path to match your location):

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

#### macOS Users:
1. Open Terminal
2. Navigate to: `~/Library/Application Support/Claude/`
3. Edit `claude_desktop_config.json` with:

```json
{
  "mcpServers": {
    "smartleave": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/Documents/Projects/SmartLeave MCP/mcp-leave-server/server.js"
      ]
    }
  }
}
```

### 4. Restart Claude Desktop

1. Completely close Claude Desktop (check system tray)
2. Reopen Claude Desktop
3. The MCP server will automatically connect

### 5. Test the Integration

Open Claude Desktop and try these commands:

#### Test 1: Login as Employee
```
Please login with email employee@company.com and password employee123
```

Expected: Success message with user profile

#### Test 2: Check Leave Balance
```
What's my current leave balance?
```

Expected: Shows available leaves (12 casual, 10 sick, 20 annual)

#### Test 3: Apply for Leave
```
I want to apply for casual leave from March 10 to March 12, 2026 for personal work
```

Expected: Leave application submitted successfully

#### Test 4: View Leave History
```
Show me all my leave applications
```

Expected: List of leave applications

#### Test 5: Login as Manager
```
Logout and login as manager@company.com with password manager123
```

Expected: Logged in as Manager User

#### Test 6: View Pending Leaves
```
Show me pending leave applications
```

Expected: List of pending leaves from team members

#### Test 7: Approve Leave
```
Approve leave ID 1
```

Expected: Leave approved successfully

## Verification Checklist

- [ ] Backend server is running on port 3000
- [ ] MCP dependencies installed successfully
- [ ] Claude Desktop config file updated with correct path
- [ ] Claude Desktop restarted completely
- [ ] Can login as employee through Claude
- [ ] Can check leave balance
- [ ] Can apply for leave
- [ ] Can login as manager
- [ ] Can view pending leaves
- [ ] Can approve/reject leaves

## Troubleshooting

### Backend Server Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# If in use, either kill that process or change port in Backend/server.js
```

### MCP Server Not Showing in Claude
1. Verify the path in config is absolute and correct
2. Check Node.js is installed: `node --version`
3. Look for errors in Claude Desktop developer console
4. Ensure backend is actually running

### "Not authenticated" Error
1. Use the `login` tool first
2. Verify credentials are correct
3. If still failing, restart backend server

### Tools Not Working
1. Ensure backend API is accessible: `curl http://localhost:3000/api/health`
2. Check Claude Desktop logs for errors
3. Verify MCP server can connect to backend

## File Paths Reference

Replace these with your actual paths:

**Backend:**
- Windows: `C:\Users\sabar\Documents\Projects\SmartLeave MCP\Backend`
- macOS: `/Users/YOUR_USERNAME/Documents/Projects/SmartLeave MCP/Backend`

**MCP Server:**
- Windows: `C:\Users\sabar\Documents\Projects\SmartLeave MCP\mcp-leave-server`
- macOS: `/Users/YOUR_USERNAME/Documents/Projects/SmartLeave MCP/mcp-leave-server`

**Claude Config:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

## Next Steps

Once everything is working:

1. Try different user roles (Employee, Manager, Admin)
2. Test all leave operations
3. Explore user management features
4. Review the API documentation for more details

## Need Help?

Check these resources:
- [Backend API Documentation](../Backend/API_DOCUMENTATION.md)
- [MCP Server README](README.md)
- [Main Project README](../README.md)

---

**Happy Leave Managing! 🎉**
