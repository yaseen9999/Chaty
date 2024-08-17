const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  profilePicture: {
    type: String, // URL to the profile picture
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

const UserProfile = mongoose.model('userprofile', userProfileSchema);

module.exports = UserProfile;
