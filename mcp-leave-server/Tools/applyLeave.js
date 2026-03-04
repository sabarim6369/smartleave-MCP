const { apiRequest, formatSuccess, formatError } = require('../utils');

/**
 * Apply for leave
 */
async function applyLeave(args) {
  try {
    const { leaveType, startDate, endDate, reason } = args;
    
    if (!leaveType || !startDate || !endDate || !reason) {
      throw new Error('Leave type, start date, end date, and reason are required');
    }
    
    const leaveData = {
      leaveType,
      startDate,
      endDate,
      reason
    };
    
    const result = await apiRequest('/api/leaves/apply', 'POST', leaveData);
    
    return formatSuccess(result.data, 'Leave application submitted successfully');
  } catch (error) {
    return formatError(error);
  }
}

// Tool definition for MCP
const applyLeaveTool = {
  name: 'apply_leave',
  description: 'Apply for leave by specifying the leave type, dates, and reason. The system will automatically calculate working days and check your leave balance.',
  inputSchema: {
    type: 'object',
    properties: {
      leaveType: {
        type: 'string',
        description: 'Type of leave to apply for',
        enum: ['casual', 'sick', 'annual', 'unpaid']
      },
      startDate: {
        type: 'string',
        description: 'Start date of leave in YYYY-MM-DD format (e.g., 2026-03-10)'
      },
      endDate: {
        type: 'string',
        description: 'End date of leave in YYYY-MM-DD format (e.g., 2026-03-12)'
      },
      reason: {
        type: 'string',
        description: 'Reason for taking leave'
      }
    },
    required: ['leaveType', 'startDate', 'endDate', 'reason']
  }
};

module.exports = { applyLeave, applyLeaveTool };
