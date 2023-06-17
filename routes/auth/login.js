const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const loginUser = require('../../services/loginService');

// @route    POST /login
// @desc     Login user
// @access   Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);

module.exports = router;
