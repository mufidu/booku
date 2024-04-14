const express = require('express');
const User = require('../models/user.model.js');
const authenticateToken = require('../middleware/auth.middleware.js');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, '-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.put('/', authenticateToken, async (req, res) => {
  const { username, email, password } = req.body;
  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.json({ username: updatedUser.username, email: updatedUser.email });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
