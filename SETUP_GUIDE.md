# SLTB Web Application - Complete Setup Guide

This guide will help you set up the complete SLTB (Sri Lanka Tea Board) web application with working signup functionality.

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**
- **Git** (optional)

## Quick Start

### 1. Database Setup

First, create the MySQL database:

```sql
CREATE DATABASE sltbwix;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup database (creates tables and admin user)
npm run setup

# Test database connection
npm run test-db

# Start backend server
npm run dev
```

The backend will start on `http://localhost:8070`

### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Test Signup

1. Open browser and go to `http://localhost:5173/signup`
2. Fill out the signup form with valid data
3. Submit the form
4. You should be automatically signed in and redirected to dashboard

## Detailed Setup

### Backend Configuration

The backend uses the following configuration in `backend/config.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=sltbwix
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=8070
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Update the database credentials according to your MySQL setup.**

### Database Schema

The application creates the following tables:

1. **users** - User accounts and authentication
2. **planting_applications** - Planting subsidy applications
3. **replanting_applications** - Replanting subsidy applications
4. **reference_entries** - Reference tracking system

### Default Users

After running `npm run setup`, the following users are created:

- **Admin User:**
  - Email: `admin@sltb.lk`
  - Password: `admin123`
  - Role: `admin`
  - Status: `active`

- **Sample User:**
  - Email: `user@example.com`
  - Password: `user123`
  - Role: `user`
  - Status: `active`

## Signup Process Flow

### 1. Frontend Validation
- Client-side validation for all form fields
- Password confirmation check
- Phone number format validation

### 2. API Request
- Data sent to `POST /api/auth/signup`
- JSON payload with user information

### 3. Backend Processing
- Server-side validation using express-validator
- Password hashing with bcrypt
- Database insertion
- JWT token generation

### 4. Response Handling
- Success: User created, token returned, auto-login
- Error: Validation errors or database errors returned

### 5. Frontend Response
- Success: Redirect to dashboard
- Error: Display error messages to user

## Testing the Application

### Test Database Connection

```bash
cd backend
npm run test-db
```

This will:
- Test database connection
- Create test user
- Verify all tables exist

### Test API Endpoints

Use curl or Postman to test the signup endpoint:

```bash
curl -X POST http://localhost:8070/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "phone_number": "0771234567",
    "password": "password123"
  }'
```

### Test Frontend

1. Open `http://localhost:5173/signup`
2. Fill out the form
3. Submit and verify:
   - User is created in database
   - User is redirected to dashboard
   - JWT token is stored in localStorage

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error:** `Database connection failed`

**Solution:**
- Check if MySQL is running
- Verify database credentials in `config.env`
- Ensure database `sltbwix` exists
- Run: `npm run test-db`

#### 2. Backend Won't Start

**Error:** `Port already in use`

**Solution:**
- Change PORT in `config.env`
- Kill process using the port
- Check if another instance is running

#### 3. Frontend Can't Connect to Backend

**Error:** `Failed to fetch` or CORS errors

**Solution:**
- Ensure backend is running on port 8070
- Check CORS_ORIGIN in backend `config.env`
- Verify API base URL in frontend `src/services/api.js`

#### 4. Signup Not Working

**Error:** Form submission fails

**Solution:**
- Check browser console for errors
- Verify all form fields are filled correctly
- Check network tab for API request/response
- Ensure database is properly set up

### Debug Steps

1. **Check Backend Logs:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check Database:**
   ```bash
   cd backend
   npm run test-db
   ```

3. **Check Frontend:**
   - Open browser developer tools
   - Check console for errors
   - Check network tab for failed requests

4. **Check Database Directly:**
   ```sql
   USE sltbwix;
   SELECT * FROM users;
   ```

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Both client and server-side
- **SQL Injection Protection** - Parameterized queries
- **CORS Protection** - Configurable CORS settings
- **Rate Limiting** - Prevents abuse

## Production Deployment

### Environment Variables

Update `config.env` for production:

```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build Frontend

```bash
cd frontend
npm run build
```

### Deploy Backend

```bash
cd backend
npm start
```

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Run the test commands
4. Check logs for specific error messages
5. Ensure database is properly configured

## File Structure

```
SLTB-WEBAPP_Final/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── config.env               # Environment variables
│   ├── server.js                # Main server file
│   ├── setup.js                 # Database setup script
│   └── test-db.js               # Database test script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── SignUp/          # Signup component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   └── services/
│   │       └── api.js           # API service
│   └── package.json
└── README.md
```

## Next Steps

After successful setup:

1. Test all signup scenarios
2. Test signin functionality
3. Explore other features (planting, replanting applications)
4. Customize the application as needed
5. Deploy to production environment 