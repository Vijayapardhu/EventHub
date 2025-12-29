const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get public user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserById,
};
