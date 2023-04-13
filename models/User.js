// /models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    apartment: {
        country: { type: String, required: true },
        region: { type: String, required: true },
        city: { type: String, required: true },
        rooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        pictures: { type: [String], required: true }
    },
    plans: [{
        type: Schema.Types.ObjectId,
        ref: 'Plan',
    }],
});

module.exports = mongoose.model('User', UserSchema);
