const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware.js');
const User = require('../models/user.model.js');

router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send('User successfully deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
