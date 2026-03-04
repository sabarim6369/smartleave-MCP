#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Import all tools
const { login, loginTool } = require('./Tools/login');
const { logout, logoutTool } = require('./Tools/logout');
const { registerUser, registerUserTool } = require('./Tools/registerUser');
const { getProfile, getProfileTool } = require('./Tools/getProfile');
const { getUsers, getUsersTool } = require('./Tools/getUsers');
const { getUserById, getUserByIdTool } = require('./Tools/getUserById');
const { updateUser, updateUserTool } = require('./Tools/updateUser');
const { deleteUser, deleteUserTool } = require('./Tools/deleteUser');
const { applyLeave, applyLeaveTool } = require('./Tools/applyLeave');
const { getMyLeaves, getMyLeavesTool } = require('./Tools/getMyLeaves');
const { getLeaveBalance, getLeaveBalanceTool } = require('./Tools/getLeaveBalance');
const { getPendingLeaves, getPendingLeavesTool } = require('./Tools/getPendingLeaves');
const { approveLeave, approveLeaveTool } = require('./Tools/approveLeave');
const { rejectLeave, rejectLeaveTool } = require('./Tools/rejectLeave');
const { cancelLeave, cancelLeaveTool } = require('./Tools/cancelLeave');
const { getAllLeaves, getAllLeavesTool } = require('./Tools/getAllLeaves');

// Create server instance
const server = new Server(
  {
    name: 'smartleave-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define all available tools
const tools = [
  // Authentication tools
  loginTool,
  logoutTool,
  getProfileTool,
  registerUserTool,
  getUsersTool,
  getUserByIdTool,
  updateUserTool,
  deleteUserTool,
  
  // Leave management tools
  applyLeaveTool,
  getMyLeavesTool,
  getLeaveBalanceTool,
  getPendingLeavesTool,
  approveLeaveTool,
  rejectLeaveTool,
  cancelLeaveTool,
  getAllLeavesTool,
];

// Tool handlers mapping
const toolHandlers = {
  // Authentication
  'login': login,
  'logout': logout,
  'get_profile': getProfile,
  'register_user': registerUser,
  'get_users': getUsers,
  'get_user_by_id': getUserById,
  'update_user': updateUser,
  'delete_user': deleteUser,
  
  // Leave management
  'apply_leave': applyLeave,
  'get_my_leaves': getMyLeaves,
  'get_leave_balance': getLeaveBalance,
  'get_pending_leaves': getPendingLeaves,
  'approve_leave': approveLeave,
  'reject_leave': rejectLeave,
  'cancel_leave': cancelLeave,
  'get_all_leaves': getAllLeaves,
};

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Handle call tool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const handler = toolHandlers[name];
    
    if (!handler) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: `Unknown tool: ${name}`
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    // Execute the tool handler
    const result = await handler(args || {});
    return result;

  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error.message || 'An unexpected error occurred'
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Log to stderr so it doesn't interfere with MCP communication
  console.error('SmartLeave MCP Server running on stdio');
  console.error('Available tools:', tools.length);
  console.error('Ready to accept requests from Claude Desktop');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
