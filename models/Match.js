// /models/Match.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the schema for the Match model.
 */
const MatchSchema = new Schema({
    plans: [{
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Represents a Match in the application.
 * A Match is a collection of plans and associated messages.
 *
 * @typedef {object} Match
 * @property {Array.<ObjectId>} plans - The IDs of the plans associated with the match.
 * @property {ObjectId} lastMessage - The ID of the last message in the match.
 * @property {Date} lastUpdate - The date and time of the last update in the match.
 * @property {Array.<ObjectId>} messages - The IDs of the messages in the match.
 */

module.exports = mongoose.model('Match', MatchSchema);
