// /models/Message.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
