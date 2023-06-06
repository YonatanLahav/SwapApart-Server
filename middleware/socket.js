// /middleware/socket.js

const jwt = require('jsonwebtoken');
const config = require('config');
const Match = require('../models/Match');

/**
 * Retrieves the user ID from a JWT token.
 * @param {string} token - The JWT token.
 * @returns {string} The extracted user ID.
 * @throws {Error} If the token is missing or invalid.
 */
module.exports.getUserId = (token) => {
    // Check if the token doesn't exist
    if (!token) {
        // Throw an error indicating that the token is missing
        throw new Error("Token does not exist");
    }
    try {
        // Verify the token using the 'jsonwebtoken' module and the JWT secret from the configuration
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Set the 'userId' variable by extracting it from the decoded payload
        const userId = decoded.user.id;
        // Return the extracted user ID
        return userId;
    } catch (err) {
        // If an error occurs during token verification, re-throw the error
        throw err;
    }
};

/**
 * Retrieves the user ID of the other user in the match.
 * @param {string} matchId - The ID of the match.
 * @param {string} senderId - The ID of the sender user.
 * @returns {string} The user ID of the other user in the match.
 * @throws {Error} If there is an error retrieving the user ID.
 */
module.exports.getToUserId = async (matchId, senderId) => {
    try {
        const match = await Match.findById(matchId).populate('plans');
        for (const plan of match.plans) {
            if (plan.userId !== senderId) {
                return plan.userId.toString();
            }
        }
    } catch (error) {
        console.error(error);
    }
};
