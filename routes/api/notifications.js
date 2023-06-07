// /routes/api/notifications.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Plan = require('../../models/Plan');
const User = require('../../models/User');
const Match = require('../../models/Match');

/**
 * @route   GET api/notifications
 * @desc    Get all notifications of the user.
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    try {
        res.json(user.notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
