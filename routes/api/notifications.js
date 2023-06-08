const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

/**
 * @route   GET api/notifications
 * @desc    Get all notifications of the user.
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route   DELETE api/notifications
 * @desc    Delete all notifications of the user.
 * @access  Private
 */
router.delete('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.notifications = []; // Remove all notifications
        await user.save();
        res.json({ message: 'Notifications deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
