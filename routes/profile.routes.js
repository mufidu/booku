const express = require('express');
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
    res.status(500).send('Internal Server Error');
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
