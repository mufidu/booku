const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const router = express.Router();

// Endpoint to create a user profile
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

// Retrieve the authenticated user's profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id, '-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(401).send('Invalid token');
  }
});

// Update the authenticated user's profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { password, ...update } = req.body; // Ignore password field from update
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const update = { username: req.body.username, email: req.body.email };
    const updatedUser = await User.findByIdAndUpdate(decoded.id, update, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('Profile updated successfully');
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send('Email already in use');
    } else if (error.code === 'SomeErrorCodeForUsernameDuplication') { // Replace 'SomeErrorCodeForUsernameDuplication' with the actual error code
      res.status(400).send('Username already in use');
    } else {
      res.status(401).send('Invalid token');
    }
  }
});

module.exports = router;
