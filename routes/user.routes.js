const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const authenticateToken = require('../middleware/auth.middleware.js');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    const newUser = await user.save();
    res.status(201).send({ userId: newUser._id });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send('Email already registered');
    } else {
      res.status(500).send('Server error');
    }
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    res.status(200).send({ jwt: token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });
    res.status(200).send({ username: updatedUser.username, email: updatedUser.email });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
