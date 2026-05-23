const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforlocaldevelopment12345');
    
    const user = await User.findById(decoded.id).select('id username role');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Attach user to request with both id (for compatibility) and _id
    req.user = {
      id: user._id.toString(), // Convert ObjectId to string for compatibility
      _id: user._id,
      username: user.username,
      role: user.role
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
