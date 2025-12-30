const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isStrongPassword(password) {
  if (!password || password.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
}

async function signup(req, res) {
  try {
    const { fullName, email, password, role, userType } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters and include letters and numbers' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email: email.toLowerCase(),
      password: hashed
    };

    // Set role if provided (for admin signup)
    if (role === 'admin') {
      userData.role = 'admin';
    }

    // Set userType if provided (for user signup)
    if (userType && ['developer', 'manager', 'employee', 'designer', 'qa', 'hr'].includes(userType)) {
      userData.userType = userType;
    }

    const user = await User.create(userData);

    const token = generateToken(user);
    const responseData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      userType: user.userType,
      status: user.status
    };

    return res.status(201).json({ token, user: responseData });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to sign up' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'User is inactive' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      userType: user.userType,
      status: user.status,
      lastLogin: user.lastLogin
    };

    return res.json({ token, user: userData });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login' });
  }
}

function getCurrentUser(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json({ user: req.user });
}

async function adminSignup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters and include letters and numbers' });
    }

    // Check if any admin already exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    // Allow first admin creation, but if admins exist, require authentication
    if (adminCount > 0) {
      // Check if user is authenticated and is an admin
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ 
          message: 'Admin accounts already exist. Please contact an existing administrator to create new admin accounts, or login as admin first.' 
        });
      }

      const jwt = require('jsonwebtoken');
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        
        if (!currentUser || currentUser.role !== 'admin') {
          return res.status(403).json({ 
            message: 'Only existing administrators can create new admin accounts. Please login as admin first.' 
          });
        }
      } catch (err) {
        return res.status(403).json({ 
          message: 'Invalid or expired token. Please login as admin first to create new admin accounts.' 
        });
      }
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      role: 'admin'
    });

    const token = generateToken(user);
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status
    };

    return res.status(201).json({ 
      token, 
      user: userData,
      message: adminCount === 0 ? 'First admin account created successfully!' : 'Admin account created successfully!'
    });
  } catch (err) {
    console.error('Admin signup error:', err);
    return res.status(500).json({ message: 'Failed to sign up: ' + (err.message || 'Internal server error') });
  }
}

async function userSignup(req, res) {
  try {
    const { fullName, email, password, userType } = req.body;

    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters and include letters and numbers' });
    }

    const validUserTypes = ['developer', 'manager', 'employee', 'designer', 'qa', 'hr'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      role: 'user',
      userType
    });

    const token = generateToken(user);
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      userType: user.userType,
      status: user.status
    };

    return res.status(201).json({ token, user: userData });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to sign up' });
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser,
  adminSignup,
  userSignup
};


