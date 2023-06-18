// /test/loginService.test.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const loginUser = require('../services/loginService');

// Mocking dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('express-validator');
jest.mock('../models/User');

/**
 * Tests for the loginUser function.
 */
describe('loginUser', () => {
    let req, res;

    beforeEach(() => {
        // Create a mock request and response object for each test case
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        // Reset mock function calls after each test case
        jest.resetAllMocks();
    });

    test('should return 400 if validation errors exist', async () => {
        // Mock the validationResult to return validation errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => false,
            array: () => [{ msg: 'Invalid email' }],
        });

        await loginUser(req, res);

        // Validate that the expected responses are returned
        expect(validationResult).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid email' }] });
    });

    test('should return 400 if user does not exist', async () => {
        // Mock the validationResult to indicate no validation errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to return null (user not found)
        User.findOne.mockResolvedValueOnce(null);

        await loginUser(req, res);

        // Validate that the expected database query and responses are performed
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    test('should return 400 if password is incorrect', async () => {
        // Mock the validationResult to indicate no validation errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to return a user object with a hashed password
        User.findOne.mockResolvedValueOnce({
            password: 'hashedPassword',
        });

        // Mock the bcrypt.compare method to return false (incorrect password)
        bcrypt.compare.mockResolvedValueOnce(false);

        await loginUser(req, res);

        // Validate that the expected database query and responses are performed
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashedPassword');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
    });

    test('should generate JWT token and return it as response', async () => {
        // Mock the validationResult to indicate no validation errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to return a user object with an ID and hashed password
        User.findOne.mockResolvedValueOnce({
            id: 'user_id',
            password: 'hashedPassword',
        });

        // Mock the bcrypt.compare method to return true (correct password)
        bcrypt.compare.mockResolvedValueOnce(true);

        // Mock the jwt.sign method to invoke the callback with a JWT token
        const jwtToken = 'generatedToken';
        jwt.sign.mockImplementationOnce((payload, secret, options, callback) => {
            callback(null, jwtToken);
        });

        await loginUser(req, res);

        // Validate that the expected database query, JWT token generation, and responses are performed
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
            { user: { id: 'user_id' } },
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            expect.any(Function)
        );
        expect(res.json).toHaveBeenCalledWith({ token: jwtToken });
    });

    test('should handle server error', async () => {
        // Mock the validationResult to indicate no validation errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to throw an error
        User.findOne.mockRejectedValueOnce('Database error');

        await loginUser(req, res);

        // Validate that the expected database query and error handling responses are performed
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});
