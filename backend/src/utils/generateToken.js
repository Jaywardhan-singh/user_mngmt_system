const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    id: user._id,
    role: user.role
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES || '1d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;


