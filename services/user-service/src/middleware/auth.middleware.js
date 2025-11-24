const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const authenticateToken = (req, res, next) => {
  console.log('Auth middleware called for:', req.method, req.path);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    console.log('Token verified for user:', user.userId);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin
};
