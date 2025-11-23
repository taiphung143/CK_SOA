module.exports = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: '7d'
};
