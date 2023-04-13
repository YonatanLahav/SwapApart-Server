// /models/Conversation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationhSchema = new Schema({
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Conversation', ConversationhSchema);
