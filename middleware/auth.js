// /middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Middleware for authenticating and verifying JWT token
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Callback function to move to the next middleware
 */
module.exports = function (req, res, next) {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Check if token doesn't exist
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Set user from payload
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
