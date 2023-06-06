// /models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Defines the schema for the User model.
 */
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
        rooms: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        pictures: {
            type: [String],
            required: true
        }
    },
    plans: [{
        type: Schema.Types.ObjectId,
        ref: 'Plan',
    }],
});

/**
 * Represents a User in the application.
 *
 * @typedef {object} User
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {Date} date - The registration date of the user.
 * @property {object} apartment - The details of the user's apartment.
 * @property {string} apartment.country - The country of the apartment.
 * @property {string} apartment.region - The region of the apartment.
 * @property {string} apartment.city - The city of the apartment.
 * @property {number} apartment.rooms - The number of rooms in the apartment.
 * @property {number} apartment.bathrooms - The number of bathrooms in the apartment.
 * @property {string[]} apartment.pictures - The pictures of the apartment.
 * @property {ObjectId[]} plans - The IDs of the plans created by the user.
 */

module.exports = mongoose.model('User', UserSchema);
