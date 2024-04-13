const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const authenticateToken = require('../middleware/auth.middleware.js');

router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
