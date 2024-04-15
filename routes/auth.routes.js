const express = require('express');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/passwordUtil.js');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const { validateInput } = require('../utils/validateInput.js');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    if (!validateInput('username', req.body.username)) return res.status(400).send('Invalid username');
    if (!validateInput('email', req.body.email)) return res.status(400).send('Invalid email');
    if (!validateInput('password', req.body.password)) return res.status(400).send('Invalid password');
    const hashedPassword = await hashPassword(req.body.password);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    const newUser = await user.save();
    if (!newUser) {
      return res.status(500).send('Failed to create user due to a database error.');
    }
    res.status(201).json({ userId: newUser._id });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send('Email already registered');
    } else if (error.name === 'ValidationError') {
      res.status(400).send('User creation failed: Invalid data');
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

module.exports = router;
