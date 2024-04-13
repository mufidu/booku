const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const authenticateToken = require('../middleware/auth.middleware.js');

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, '-__v');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updateData = { username, email, ...(hashedPassword && { password: hashedPassword }) };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true, context: 'query' });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Server error');
    }
  }
});

module.exports = router;
