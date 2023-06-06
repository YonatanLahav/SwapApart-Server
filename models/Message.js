// /models/Message.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the schema for the Message model.
 */
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

/**
 * Represents a Message in the application.
 *
 * @typedef {object} Message
 * @property {ObjectId} match - The ID of the match associated with the message.
 * @property {ObjectId} sender - The ID of the user who sent the message.
 * @property {string} text - The text content of the message.
 * @property {Date} createdAt - The date and time when the message was created.
 */

module.exports = mongoose.model('Message', MessageSchema);
