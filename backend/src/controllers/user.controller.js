const bcrypt = require('bcryptjs');
const User = require('../models/User');

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

async function getUsers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, '-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.json({
      users,
      page,
      totalPages,
      total
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
}

async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update user status' });
  }
}

async function getProfile(req, res) {
  return res.json({ user: req.user });
}

async function updateProfile(req, res) {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    req.user.fullName = fullName;
    req.user.email = email.toLowerCase();
    await req.user.save();

    const user = await User.findById(req.user.id).select('-password');

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile' });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (!isStrongPassword(newPassword)) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters and include letters and numbers' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to change password' });
  }
}

module.exports = {
  getUsers,
  updateUserStatus,
  getProfile,
  updateProfile,
  changePassword
};


