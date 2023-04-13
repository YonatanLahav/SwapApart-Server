// /models/Match.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    plans: [{
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    }],
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    }
});
module.exports = mongoose.model('Match', MatchSchema);
