// Import required modules
const express = require('express');
const router = express.Router();
const Conversation = require('../../models/Conversation');

// GET all conversations
router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('users match');
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific conversation
router.get('/:id', getConversation, (req, res) => {
    res.json(res.conversation);
});

// CREATE a new conversation
router.post('/', async (req, res) => {
    const conversation = new Conversation({
        match: req.body.match,
        users: req.body.users,
        lastUpdate: req.body.lastUpdate
    });

    try {
        const newConversation = await conversation.save();
        res.status(201).json(newConversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a conversation
router.patch('/:id', getConversation, async (req, res) => {
    if (req.body.match != null) {
        res.conversation.match = req.body.match;
    }

    if (req.body.users != null) {
        res.conversation.users = req.body.users;
    }

    if (req.body.lastUpdate != null) {
        res.conversation.lastUpdate = req.body.lastUpdate;
    }

    try {
        const updatedConversation = await res.conversation.save();
        res.json(updatedConversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a conversation
router.delete('/:id', getConversation, async (req, res) => {
    try {
        await res.conversation.remove();
        res.json({ message: 'Conversation deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a specific conversation by ID
async function getConversation(req, res, next) {
    try {
        const conversation = await Conversation.findById(req.params.id).populate('users match');
        if (conversation == null) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        res.conversation = conversation;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = router;
