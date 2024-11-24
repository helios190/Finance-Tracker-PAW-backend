const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register a new user with profile details
exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    name,
    mobileNumber,
    target,
    balance,
    profilePicture
  } = req.body;

  try {
    // Check if the email or username is already in use
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or Username already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      name,
      mobileNumber,
      target,
      balance,
      profilePicture
    });

    await user.save();

    res.status(201).json({
      message: `User ${username} successfully created`,
      data: {
        username: user.username,
        email: user.email,
        name: user.name,
        balance: user.balance,
        target: user.target
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login and return user profile along with token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        mobileNumber: user.mobileNumber,
        balance: user.balance,
        target: user.target,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile details
exports.updateProfile = async (req, res) => {
  const { id } = req.params; // User ID from params
  const updates = req.body; // New profile data

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile by ID
exports.getProfile = async (req, res) => {
  const { id } = req.params; // User ID from params

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile retrieved successfully',
      data: {
        username: user.username,
        email: user.email,
        name: user.name,
        mobileNumber: user.mobileNumber,
        balance: user.balance,
        target: user.target,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update email
exports.updateEmail = async (req, res) => {
  const { id } = req.params; // User ID
  const { email, currentPassword } = req.body; // New email and current password for verification

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

    // Update email
    user.email = email;
    await user.save();

    res.json({ message: 'Email updated successfully', email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  const { id } = req.params; // User ID
  const { currentPassword, newPassword } = req.body; // Current and new passwords

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

    // Update password
    user.password = newPassword; // The `pre('save')` middleware will hash it
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update other profile details
exports.updateProfileDetails = async (req, res) => {
  const { id } = req.params; // User ID
  const updates = req.body; // Profile details to update

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile details updated successfully',
      data: {
        name: updatedUser.name,
        mobileNumber: updatedUser.mobileNumber,
        target: updatedUser.target,
        balance: updatedUser.balance,
        profilePicture: updatedUser.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};