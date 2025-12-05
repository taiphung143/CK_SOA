const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  // Support both JWT user object and x-user-role header
  const userRole = req.user?.role || req.headers['x-user-role'];
  
  console.log('isAdmin middleware - Role:', userRole);
  console.log('isAdmin middleware - Headers:', req.headers['x-user-role'], req.headers['x-user-id']);
  
  if (!userRole || userRole !== 'admin') {
    console.log('isAdmin middleware - Access denied. Role:', userRole);
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  console.log('isAdmin middleware - Access granted');
  next();
};

module.exports = {
  authenticateToken,
  isAdmin
};