# SLTB Backend API

This is the backend API for the Sri Lanka Tea Board web application.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Database Setup

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE sltbwix;
   ```

2. **Configure Environment Variables:**
   Copy the `config.env` file and update the database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sltbwix
   DB_PORT=3306
   ```

## Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Database:**
   ```bash
   npm run setup
   ```
   This will:
   - Test database connection
   - Create all necessary tables
   - Create admin user (admin@sltb.lk / admin123)
   - Create sample data for testing

3. **Test Database Connection:**
   ```bash
   npm run test-db
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 8070 (or the port specified in config.env).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/me` - Get current user profile

### Signup Process

The signup endpoint accepts the following data:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone_number": "0771234567",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone_number": "0771234567",
    "role": "user",
    "status": "pending"
  },
  "token": "jwt_token_here"
}
```

## Database Schema

### Users Table
- `id` - Primary key
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - Unique email address
- `phone_number` - Phone number
- `password` - Hashed password
- `role` - User role (user, admin, officer)
- `status` - Account status (active, inactive, pending)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

## Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check if MySQL is running
   - Verify database credentials in config.env
   - Ensure database 'sltbwix' exists

2. **Port Already in Use:**
   - Change PORT in config.env
   - Kill process using the port

3. **CORS Issues:**
   - Update CORS_ORIGIN in config.env to match frontend URL

### Testing

1. **Test Database:**
   ```bash
   npm run test-db
   ```

2. **Test API Endpoints:**
   Use tools like Postman or curl to test endpoints:
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

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- Rate limiting
- CORS protection
- Helmet security headers

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | localhost |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | admin123 |
| DB_NAME | Database name | sltbwix |
| DB_PORT | Database port | 3306 |
| JWT_SECRET | JWT secret key | your_super_secret_jwt_key_here |
| JWT_EXPIRES_IN | JWT expiration | 24h |
| PORT | Server port | 8070 |
| NODE_ENV | Environment | development |
| CORS_ORIGIN | CORS origin | http://localhost:5173 | 