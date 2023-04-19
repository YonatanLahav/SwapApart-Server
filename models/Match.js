// /models/Match.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
});
module.exports = mongoose.model('Match', MatchSchema);
