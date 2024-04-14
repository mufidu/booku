const express = require('express');
const authenticateToken = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, 'username email password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
const updatedUser = await User.findByIdAndUpdate(req.user._id, { username, email, password: hashedPassword }, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send('Invalid user data');
    } else {
      res.status(500).send('Server error');
    }
  }
});

module.exports = router;
