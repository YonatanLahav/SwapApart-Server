// /services/registerService.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, apartment } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            apartment: {
                country: apartment.country,
                region: apartment.region,
                city: apartment.city,
                rooms: apartment.rooms,
                bathrooms: apartment.bathrooms,
                pictures: apartment.pictures
            }
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        // console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports = registerUser;
