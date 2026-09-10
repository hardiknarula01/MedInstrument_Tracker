const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies token, attaches user to req
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Restricts access to specific roles: authorize('admin', 'sales')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' not permitted for this action` });
    }
    next();
  };
};

module.exports = { protect, authorize };