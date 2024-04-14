const express = require('express');
const User = require('../models/user.model.js');

const router = express.Router();

router.delete('/:id', async (req, res) => {
  try {
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
