// controllers/login.js
const UserProfile = require('../models/userprofile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Login Controller
exports.login = async (req, res) => {
  try {
    console.log('api call login ')
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Find user by email
    const user = await UserProfile.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch =await bcrypt.compare(password,user.password)
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }


    res.status(200).json(user._id);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
