// Import required modules
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Plan = require('../../models/Plan');
const Swipe = require('../../models/Swipe');
const User = require('../../models/User');
const Conversation = require('../../models/Conversation');


// @route   GET api/conversations
// @desc    Get all Conversations of the user.
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({ users: { $in: [req.user.id] } })
            .sort('-lastUpdate')
            .populate('match')
            .populate('users');
        res.json(conversations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/conversations/all
// @desc    Get all Conversations of the user.
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({ users: { $in: [req.user.id] } })
            .sort('-lastUpdate')
            .populate('match')
            .populate('users');
        res.json(conversations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
