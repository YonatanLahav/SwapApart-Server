// /models/Swipe.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SwipeSchema = new mongoose.Schema({
    swiperPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    swipedPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    isLiked: {
        type: Boolean,
        required: true
    },
});

const Swipe = mongoose.model('Swipe', SwipeSchema);

module.exports = Swipe;
