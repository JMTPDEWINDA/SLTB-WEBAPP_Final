# SLTB Frontend

This is the frontend application for the Sri Lanka Tea Board web application built with React and Vite.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 8070

## Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:5173`

## Signup Functionality

The signup process is now completely integrated with the backend database. Here's how it works:

### Signup Form Fields

- **First Name** - Required, 2-50 characters
- **Last Name** - Required, 2-50 characters  
- **Email** - Required, must be valid email format
- **Phone Number** - Required, 9-11 digits
- **Password** - Required, minimum 6 characters
- **Confirm Password** - Required, must match password

### Signup Process

1. User fills out the signup form
2. Client-side validation is performed
3. Data is sent to backend API (`POST /api/auth/signup`)
4. Backend validates data and creates user in database
5. User is automatically signed in and redirected to dashboard
6. JWT token is stored for authentication

### Error Handling

- **Validation Errors** - Displayed as red error messages
- **Network Errors** - Handled gracefully with user-friendly messages
- **Duplicate Email** - Prevents registration with existing email

## API Integration

The frontend communicates with the backend through the API service (`src/services/api.js`):

- **Base URL**: `http://localhost:8070/api`
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Consistent error handling across all API calls

## Authentication Flow

1. **Signup** → Creates user account → Auto-login → Dashboard
2. **Signin** → Validates credentials → Stores token → Dashboard
3. **Protected Routes** → Check token → Redirect if not authenticated
4. **Logout** → Clear token → Redirect to home

## Components Structure

```
src/
├── components/
│   ├── SignUp/           # Signup form component
│   ├── SignIn/           # Signin form component
│   ├── Dashboard/        # User dashboard
│   ├── Header/           # Navigation header
│   └── ...
├── context/
│   └── AuthContext.jsx   # Authentication state management
├── services/
│   └── api.js           # API service functions
└── ...
```

## Testing the Signup

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Signup:**
   - Navigate to `/signup`
   - Fill out the form with valid data
   - Submit and verify user is created in database
   - Check that user is redirected to dashboard

## Troubleshooting

### Common Issues

1. **Backend Connection Failed:**
   - Ensure backend is running on port 8070
   - Check CORS configuration in backend
   - Verify API base URL in `src/services/api.js`

2. **Database Connection Issues:**
   - Run `npm run test-db` in backend directory
   - Check MySQL is running
   - Verify database credentials

3. **Signup Not Working:**
   - Check browser console for errors
   - Verify all form fields are filled correctly
   - Check network tab for API request/response

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

3. **Check Frontend Console:**
   - Open browser developer tools
   - Check console for errors
   - Check network tab for failed requests

## Environment Variables

The frontend uses the following configuration:

- **API Base URL**: `http://localhost:8070/api` (hardcoded in `src/services/api.js`)
- **Frontend URL**: `http://localhost:5173` (Vite default)

## Security Features

- **Input Validation** - Client-side validation for all forms
- **Password Confirmation** - Ensures passwords match
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Routes that require authentication
- **Error Handling** - User-friendly error messages

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add routes in `src/App.jsx`
3. Update API service if needed
4. Test with backend integration

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use consistent naming conventions
- Add proper error handling

## Build for Production

```bash
npm run build
```

This creates a production build in the `dist/` directory.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Verify backend is running correctly
3. Check browser console for errors
4. Test database connection
