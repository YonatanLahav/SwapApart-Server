// /models/Swipe.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the schema for the Swipe model.
 */
const SwipeSchema = new Schema({
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

/**
 * Represents a Swipe in the application.
 *
 * @typedef {object} Swipe
 * @property {ObjectId} swiperPlan - The ID of the plan that initiated the swipe.
 * @property {ObjectId} swipedPlan - The ID of the plan that was swiped on.
 * @property {boolean} isLiked - Indicates whether the swipe is a like or not.
 */

const Swipe = mongoose.model('Swipe', SwipeSchema);

module.exports = Swipe;
