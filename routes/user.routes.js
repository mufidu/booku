const express = require('express');
const User = require('../models/user.model.js');
const { validateUsername, validateEmail, validatePassword } = require('../utils/validateInput.js');

const router = express.Router();

router.delete('/', async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send('ID is required');
    }
    const deletedUser = await User.findByIdAndDelete(req.body.id);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(JSON.stringify('User deleted successfully'));
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
