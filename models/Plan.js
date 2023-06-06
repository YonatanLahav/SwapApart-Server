// /models/Plan.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the schema for the Plan model.
 */
const PlanSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    country: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    minRoomsNum: {
        type: Number,
        required: true
    },
    minBathroomsNum: {
        type: Number,
        required: true
    },
    matchs: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }]
});

/**
 * Represents a Plan in the application.
 *
 * @typedef {object} Plan
 * @property {ObjectId} userId - The ID of the user associated with the plan.
 * @property {Date} startDate - The start date of the plan.
 * @property {Date} endDate - The end date of the plan.
 * @property {string} country - The country of the plan.
 * @property {string} region - The region of the plan.
 * @property {string} city - The city of the plan.
 * @property {number} minRoomsNum - The minimum number of rooms required in the plan.
 * @property {number} minBathroomsNum - The minimum number of bathrooms required in the plan.
 * @property {ObjectId[]} matchs - The IDs of the matches associated with the plan.
 */

module.exports = mongoose.model('Plan', PlanSchema);
