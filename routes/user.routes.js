const express = require('express');
const User = require('../models/user.model.js');
const authenticateToken = require('../middleware/auth.middleware.js');

const router = express.Router();

router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User successfully deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
