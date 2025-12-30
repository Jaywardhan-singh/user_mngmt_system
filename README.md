# 🧑‍💻MUMS - Mini IT User Management System 

A comprehensive full-stack web application for managing user accounts with role-based access control (RBAC), designed for IT companies with different user types and administrative controls.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment Instructions](#deployment-instructions)
- [Project Structure](#project-structure)
- [Testing](#testing)

## 🎯 Project Overview

**MUMS (Mini User Management System)** is a secure, scalable user management system built for IT companies. It provides:

- **Separate Authentication Flows**: Distinct signup/login for administrators and employees
- **Role-Based Access Control (RBAC)**: Admin and user roles with different permissions
- **User Type Management**: Support for different employee types (Developer, Manager, Employee, Designer, QA, HR)
- **User Lifecycle Management**: Activate/deactivate users, update profiles, change passwords
- **Modern UI/UX**: Responsive design with toast notifications, loading states, and smooth animations
- **Security**: JWT authentication, bcrypt password hashing, protected routes

### Purpose

This system enables IT companies to:
- Manage employee accounts efficiently
- Control access based on roles and permissions
- Track user activity and status
- Provide secure authentication and authorization

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 4.21.1
- **Database**: MongoDB (with Mongoose 8.8.0)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Environment Variables**: dotenv 16.4.5
- **Testing**: Jest 29.7.0, Supertest 7.1.1, MongoDB Memory Server 10.1.4

### Frontend

- **Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.0
- **Routing**: React Router DOM 6.28.0
- **HTTP Client**: Axios 1.7.7
- **Styling**: Plain CSS with CSS Variables
- **State Management**: React Context API

### Deployment

- **Backend**: Render
- **Frontend**: Vercel
- **Database**: MongoDB Atlas (Cloud-hosted)

## ✨ Features

### Authentication & Authorization

- ✅ Separate admin and user signup/login flows
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes with middleware
- ✅ Password visibility toggle
- ✅ First admin creation without restrictions

### User Management

- ✅ User profile management
- ✅ Password change functionality
- ✅ User type assignment (Developer, Manager, Employee, Designer, QA, HR)
- ✅ User status management (Active/Inactive)
- ✅ Admin dashboard with user statistics
- ✅ Paginated user listing (10 per page)

### UI/UX

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Toast notifications (Success, Error, Info)
- ✅ Loading spinners for async operations
- ✅ Modern gradient backgrounds with animations
- ✅ Smooth transitions and hover effects
- ✅ Accessible form inputs and buttons

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

5. **Start MongoDB** (if using local MongoDB)
   ```bash
   # On Windows (if MongoDB is installed as service, it should start automatically)
   # On Mac/Linux
   sudo systemctl start mongod
   # Or using Homebrew
   brew services start mongodb-community
   ```

6. **Run the server**
   ```bash
   # Development mode (with nodemon for auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   The backend server will start on `http://localhost:5000` (or the port specified in `.env`)

7. **Run tests** (optional)
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables) section)

5. **Start development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173` (Vite default port)

6. **Build for production** (optional)
   ```bash
   npm run build
   ```

### First-Time Setup

1. **Start both backend and frontend servers** (in separate terminals)

2. **Create the first admin account**:
   - Navigate to `http://localhost:5173`
   - Click on "Admin Signup"
   - Fill in the form and create your first admin account
   - You'll be automatically logged in and redirected to the dashboard

3. **Create user accounts**:
   - Logout (if logged in as admin)
   - Click on "User Signup"
   - Select a user type and create employee accounts

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/mums
# For MongoDB Atlas, use:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRES=1d
```

**Important**: 
- Replace `JWT_SECRET` with a strong, random string (minimum 32 characters)
- For production, use a secure MongoDB Atlas connection string
- Never commit `.env` files to version control

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:5000
```

**For Production**:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📚 API Documentation

### Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-backend-url.onrender.com`

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication Endpoints

##### 1. Admin Signup
Create a new administrator account.

**Endpoint**: `POST /api/auth/admin/signup`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "admin@company.com",
  "password": "AdminPass123"
}
```

**Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "admin@company.com",
    "role": "admin",
    "status": "active"
  },
  "message": "First admin account created successfully!"
}
```

**Note**: First admin can be created without restrictions. Subsequent admins require authentication.

---

##### 2. Admin Login
Login as administrator.

**Endpoint**: `POST /api/auth/admin/login`

**Request Body**:
```json
{
  "email": "admin@company.com",
  "password": "AdminPass123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "admin@company.com",
    "role": "admin",
    "status": "active",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

---

##### 3. User Signup
Create a new employee account.

**Endpoint**: `POST /api/auth/user/signup`

**Request Body**:
```json
{
  "fullName": "Jane Smith",
  "email": "jane@company.com",
  "password": "UserPass123",
  "userType": "developer"
}
```

**Valid userType values**: `developer`, `manager`, `employee`, `designer`, `qa`, `hr`

**Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith",
    "email": "jane@company.com",
    "role": "user",
    "userType": "developer",
    "status": "active"
  }
}
```

---

##### 4. User Login
Login as employee.

**Endpoint**: `POST /api/auth/user/login`

**Request Body**:
```json
{
  "email": "jane@company.com",
  "password": "UserPass123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith",
    "email": "jane@company.com",
    "role": "user",
    "userType": "developer",
    "status": "active",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

---

##### 5. Get Current User
Get authenticated user information.

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "admin@company.com",
    "role": "admin",
    "userType": null,
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### User Endpoints (Protected)

##### 6. Get User Profile
Get current user's profile.

**Endpoint**: `GET /api/users/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith",
    "email": "jane@company.com",
    "role": "user",
    "userType": "developer",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

##### 7. Update Profile
Update current user's profile (name and email).

**Endpoint**: `PUT /api/users/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "fullName": "Jane Smith Updated",
  "email": "jane.updated@company.com"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith Updated",
    "email": "jane.updated@company.com",
    "role": "user",
    "userType": "developer",
    "status": "active"
  }
}
```

---

##### 8. Change Password
Change current user's password.

**Endpoint**: `PATCH /api/users/me/password`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

**Response** (200 OK):
```json
{
  "message": "Password updated successfully"
}
```

---

#### Admin Endpoints (Admin Only)

##### 9. Get All Users
Get paginated list of all users (Admin only).

**Endpoint**: `GET /api/users?page=1&limit=10`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200 OK):
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "admin@company.com",
      "role": "admin",
      "userType": null,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "fullName": "Jane Smith",
      "email": "jane@company.com",
      "role": "user",
      "userType": "developer",
      "status": "active",
      "createdAt": "2024-01-02T00:00:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 5,
  "total": 50
}
```

---

##### 10. Update User Status
Activate or deactivate a user (Admin only).

**Endpoint**: `PATCH /api/users/:id/status`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "status": "inactive"
}
```

**Valid status values**: `active`, `inactive`

**Response** (200 OK):
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "fullName": "Jane Smith",
    "email": "jane@company.com",
    "role": "user",
    "userType": "developer",
    "status": "inactive"
  }
}
```

---

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:
```json
{
  "message": "All fields are required"
}
```

**401 Unauthorized**:
```json
{
  "message": "Invalid credentials"
}
```

**403 Forbidden**:
```json
{
  "message": "Forbidden"
}
```

**404 Not Found**:
```json
{
  "message": "User not found"
}
```

**409 Conflict**:
```json
{
  "message": "Email already in use"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Failed to sign up"
}
```

## 🚢 Deployment Instructions

### Backend Deployment (Render)

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `backend` directory as the root directory
   - Build Command: `npm install`
   - Start Command: `node src/server.js`

3. **Configure Environment Variables** in Render dashboard:
   - `PORT`: (Auto-set by Render, but can be customized)
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secure JWT secret key
   - `JWT_EXPIRES`: `1d`

4. **Deploy**: Render will automatically deploy on every push to the main branch

5. **Get your backend URL**: `https://your-app-name.onrender.com`

### Frontend Deployment (Vercel)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your project**:
   - Connect your GitHub repository
   - Select the `frontend` directory as the root directory
   - Framework Preset: Vite

3. **Configure Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app-name.onrender.com`)

4. **Deploy**: Vercel will automatically deploy on every push

5. **Get your frontend URL**: `https://your-app-name.vercel.app`

### Database Setup (MongoDB Atlas)

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a new cluster** (Free tier available)

3. **Create a database user**:
   - Username and password
   - Database User Privileges: Read and write to any database

4. **Whitelist IP addresses**:
   - For development: Add `0.0.0.0/0` (allows all IPs)
   - For production: Add Render's IP ranges or specific IPs

5. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/mums?retryWrites=true&w=majority`

6. **Update backend `.env`** with the MongoDB Atlas connection string

### Post-Deployment Checklist

- [ ] Backend is accessible and returning responses
- [ ] Frontend environment variable points to backend URL
- [ ] CORS is configured to allow frontend domain
- [ ] Database connection is working
- [ ] First admin account can be created
- [ ] All API endpoints are accessible
- [ ] HTTPS is enabled (automatic on Render/Vercel)

## 📁 Project Structure

```
MUMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   └── user.controller.js   # User management logic
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT authentication
│   │   │   └── role.middleware.js    # Role-based access control
│   │   ├── models/
│   │   │   └── User.js               # User schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Authentication routes
│   │   │   └── user.routes.js        # User routes
│   │   ├── tests/
│   │   │   ├── auth.test.js          # Auth tests
│   │   │   ├── auth.validation.test.js
│   │   │   ├── user.test.js          # User tests
│   │   │   └── user.validation.test.js
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT token generation
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # Server entry point
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js              # Axios configuration
    │   ├── components/
    │   │   ├── ConfirmModal.jsx     # Confirmation dialog
    │   │   ├── LoadingSpinner.jsx   # Loading indicator
    │   │   ├── Navbar.jsx            # Navigation bar
    │   │   ├── Pagination.jsx        # Pagination component
    │   │   ├── PasswordInput.jsx     # Password input with toggle
    │   │   ├── ProtectedRoute.jsx    # Route protection
    │   │   └── Toast.jsx             # Toast notification
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Authentication context
    │   │   └── ToastContext.jsx      # Toast notifications context
    │   ├── pages/
    │   │   ├── AdminLogin.jsx        # Admin login page
    │   │   ├── AdminSignup.jsx      # Admin signup page
    │   │   ├── AdminUsers.jsx       # Admin user management
    │   │   ├── Dashboard.jsx        # User dashboard
    │   │   ├── Landing.jsx          # Landing page
    │   │   ├── Profile.jsx          # User profile page
    │   │   ├── UserLogin.jsx        # User login page
    │   │   └── UserSignup.jsx       # User signup page
    │   ├── App.jsx                   # Main app component
    │   ├── main.jsx                  # React entry point
    │   └── index.css                 # Global styles
    ├── .env.example                  # Environment variables template
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

Test files:
- `auth.test.js` - Authentication flow tests
- `auth.validation.test.js` - Input validation tests
- `user.test.js` - User management tests
- `user.validation.test.js` - User validation tests

### Test Coverage

The test suite includes:
- ✅ User signup and login
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Admin user management
- ✅ Pagination
- ✅ Role-based access control

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds (10)
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and user role separation
- **Input Validation**: Email format and password strength validation
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Sensitive data stored in .env files

## 📝 License

This project is created for educational and demonstration purposes and is under MIT License.

## 👥 Author

Developed as a full-stack mini user management system for basic demonstrations.

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding rate limiting
- Implementing refresh tokens
- Adding email verification
- Implementing password reset functionality
- Adding audit logging
- Enhancing error handling and logging

---

**Note**: Remember to keep your `.env` files secure and never commit them to version control. Use `.env.example` files as templates.

