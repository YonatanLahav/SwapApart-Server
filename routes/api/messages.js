// Import required modules
const express = require('express');
const router = express.Router();
const Message = require('../../models/Message');
const Match = require('../../models/Match');
const auth = require('../../middleware/auth');

// Create a new message
router.post('/', auth, async (req, res) => {
    const { match, sender, text } = req.body;
    try {
        const newMessage = new Message({ match, sender, text });
        const message = await newMessage.save();

        // Update the match's last message and last update time
        const updatedMatch = await Match.findByIdAndUpdate(
            req.body.match,
            {
                $set: {
                    lastMessage: message._id,
                    lastUpdate: Date.now(),
                },
                $push: {
                    messages: message._id
                },
            },
            { new: true }
        );

        if (!updatedMatch) {
            return res.status(404).json({ msg: 'Match not found' });
        }

        res.json(message);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
