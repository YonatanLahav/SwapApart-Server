const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { createMessage } = require('../../services/messageService');

/**
 * @route   POST api/messages
 * @desc    Create a new message
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
    const { match, sender, text } = req.body;
    try {
        const message = await createMessage(match, sender, text);
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
