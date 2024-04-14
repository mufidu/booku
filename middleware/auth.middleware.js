const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    try {
      const authenticatedUser = await User.findById(user.id);
      if (!authenticatedUser) return res.sendStatus(401);
      req.user = authenticatedUser;
      next();
    } catch (error) {
      return res.sendStatus(500);
    }
  });
};

module.exports = authenticateToken;
