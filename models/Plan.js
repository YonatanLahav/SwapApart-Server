// /models/Plan.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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
module.exports = mongoose.model('Plan', PlanSchema);
