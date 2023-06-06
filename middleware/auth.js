// /middleware/auth.js

const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Middleware function to verify the JWT token from the request header.
 * If the token is valid, it sets the user from the token payload on the request object and calls the next middleware.
 * If the token is missing or invalid, it returns a response with an appropriate error message.
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
