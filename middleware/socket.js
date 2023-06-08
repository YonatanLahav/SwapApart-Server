const jwt = require('jsonwebtoken');
const config = require('config');
const Match = require('../models/Match');

/**
 * Get the user ID from a JWT token
 * @param {string} token - JWT token
 * @returns {string} - User ID extracted from the token
 * @throws {Error} - If the token is missing or invalid
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
        userId = decoded.user.id;
        // Return the extracted user ID
        return userId;
    } catch (err) {
        // If an error occurs during token verification, re-throw the error
        throw err;
    }
};


/**
 * Get the user ID of the other user in the match
 * @param {string} matchId - ID of the match
 * @param {string} senderId - ID of the sender user
 * @returns {string} - User ID of the other user in the match
 */
module.exports.getToUserId = async (matchId, senderId) => {
    try {
        const match = await Match.findById(matchId).populate('plans');
        for (plan of match.plans) {
            if (plan.userId != senderId) {
                return plan.userId.toString();
            }
        }
    } catch (error) {
        console.error(error);
    }
};

