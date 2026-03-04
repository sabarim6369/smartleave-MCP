# MongoDB Setup Guide for SmartLeave

This guide will help you set up MongoDB for the SmartLeave backend.

## Option 1: Local MongoDB Installation (Recommended for Development)

### Windows

1. **Download MongoDB Community Server**
   - Visit: https://www.mongodb.com/try/download/community
   - Select version: Latest (Current)
   - Platform: Windows
   - Package: MSI
   - Click Download

2. **Install MongoDB**
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Verify Installation**
   ```bash
   # Open Command Prompt or PowerShell
   mongod --version
   ```

4. **Start MongoDB (if not running as service)**
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # Or manually
   mongod
   ```

### macOS

1. **Install using Homebrew**
   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   ```

2. **Start MongoDB**
   ```bash
   # Start MongoDB as a service
   brew services start mongodb-community@7.0
   
   # Or run manually
   mongod --config /opt/homebrew/etc/mongod.conf
   ```

3. **Verify Installation**
   ```bash
   mongod --version
   ```

### Linux (Ubuntu/Debian)

1. **Import MongoDB Public Key**
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Create List File**
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. **Verify Installation**
   ```bash
   mongod --version
   ```

## Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create Cluster**
   - Choose "Shared" (Free tier)
   - Select Cloud Provider & Region (closest to you)
   - Cluster Name: "SmartLeave" (or any name)
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `smartleave_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js
   - Version: Latest
   - Copy the connection string
   - It looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`

6. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://smartleave_admin:<YOUR_PASSWORD>@cluster.mongodb.net/smartleave?retryWrites=true&w=majority
   ```
   Replace `<YOUR_PASSWORD>` with your actual password

## Configuration

### Update .env File

Edit `Backend/.env`:

**For Local MongoDB:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smartleave
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartleave?retryWrites=true&w=majority
NODE_ENV=development
```

## Install Dependencies

```bash
cd Backend
npm install
```

This will install:
- `mongoose` - MongoDB ODM
- `dotenv` - Environment variables
- `bcryptjs` - Password hashing

## Start the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
MongoDB Connected: localhost:27017
Database: smartleave
Initializing default users...
Default users created successfully
SmartLeave API Server
Server is running on http://localhost:3000
```

## Verify Database

### Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connection String: `mongodb://localhost:27017`
3. Click "Connect"
4. You should see `smartleave` database with collections:
   - `users`
   - `leaves`

### Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to smartleave database
use smartleave

# View collections
show collections

# View users
db.users.find().pretty()

# View leaves
db.leaves.find().pretty()

# Count documents
db.users.countDocuments()
db.leaves.countDocuments()
```

## Default Users

After starting the server, these users will be created automatically:

| Role | Email | Password | Employee ID |
|------|-------|----------|-------------|
| Admin | admin@company.com | admin123 | EMP001 |
| Manager | manager@company.com | manager123 | EMP002 |
| Employee | employee@company.com | employee123 | EMP003 |

**Note:** Passwords are now properly hashed using bcrypt!

## Testing the Setup

1. **Test Backend API**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test Login**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@company.com","password":"admin123"}'
   ```

3. **View Data in MongoDB**
   ```bash
   mongosh smartleave
   db.users.find({email: "admin@company.com"})
   ```

## Troubleshooting

### MongoDB not starting

**Windows:**
```bash
# Check if MongoDB service is running
sc query MongoDB

# Start the service
net start MongoDB
```

**macOS/Linux:**
```bash
# Check status
sudo systemctl status mongod  # Linux
brew services list             # macOS

# Start service
sudo systemctl start mongod    # Linux
brew services start mongodb-community@7.0  # macOS
```

### Connection refused error

1. Check if MongoDB is running:
   ```bash
   mongosh
   ```

2. Check port 27017 is not in use:
   ```bash
   # Windows
   netstat -ano | findstr :27017
   
   # macOS/Linux
   lsof -i :27017
   ```

3. Verify connection string in `.env` file

### Authentication failed (MongoDB Atlas)

1. Check username and password are correct
2. Ensure IP address is whitelisted in Network Access
3. Verify connection string format
4. Password should be URL-encoded if it contains special characters

### Database not created

- Databases are created automatically when first document is inserted
- Start the backend server to trigger automatic user creation
- The `smartleave` database will be created automatically

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  employeeId: String (unique),
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: employee, manager, admin),
  department: String,
  managerId: ObjectId (reference to User),
  joinDate: Date,
  leaveBalance: {
    casual: Number,
    sick: Number,
    annual: Number,
    unpaid: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Leaves Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  leaveType: String (enum: casual, sick, annual, unpaid),
  startDate: Date,
  endDate: Date,
  days: Number,
  reason: String,
  status: String (enum: pending, approved, rejected, cancelled),
  appliedDate: Date,
  approvedBy: ObjectId (reference to User),
  approvedDate: Date,
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Backup & Restore

### Backup Database
```bash
# Backup entire database
mongodump --db=smartleave --out=./backup

# Backup specific collection
mongodump --db=smartleave --collection=users --out=./backup
```

### Restore Database
```bash
# Restore entire database
mongorestore --db=smartleave ./backup/smartleave

# Restore specific collection
mongorestore --db=smartleave --collection=users ./backup/smartleave/users.bson
```

## Security Best Practices

For production deployment:

1. **Use Strong Passwords**
   - Generate random complex passwords
   - Store in secure password manager

2. **Enable Authentication**
   ```bash
   # Create admin user in MongoDB
   mongosh
   use admin
   db.createUser({
     user: "admin",
     pwd: "strong_password",
     roles: ["root"]
   })
   ```

3. **Use Environment Variables**
   - Never commit `.env` file to git
   - Use different credentials for production

4. **IP Whitelisting**
   - Only allow specific IP addresses
   - Use VPN for remote access

5. **Enable SSL/TLS**
   - Use encrypted connections
   - MongoDB Atlas provides this by default

6. **Regular Backups**
   - Set up automated backups
   - Test restore procedures

## Next Steps

1. ✅ MongoDB installed and running
2. ✅ Backend connected to MongoDB
3. ✅ Default users created
4. 🔄 Start Backend server
5. 🔄 Test API endpoints
6. 🔄 Configure MCP server

---

**Need help?** Check the [Backend README](../Backend/API_DOCUMENTATION.md) or [Main README](../README.md)
