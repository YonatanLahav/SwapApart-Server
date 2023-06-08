// /routes/api/messages.js

const express = require('express');
const router = express.Router();
const Message = require('../../models/Message');
const Match = require('../../models/Match');
const auth = require('../../middleware/auth');

/**
 * @route   POST api/messages
 * @desc    Create a new message
 * @access  Private
 */

router.post('/', auth, async (req, res) => {
    // Extract the required fields from the request body
    const { match, sender, text } = req.body;
    try {
        // Create a new message object
        const newMessage = new Message({ match, sender, text });
        // Save the new message to the database
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

        // Check if the match was not found
        if (!updatedMatch) {
            return res.status(404).json({ msg: 'Match not found' });
        }

        // Send the created message as the response
        res.json(message);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
