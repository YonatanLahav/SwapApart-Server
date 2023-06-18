// Import required modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const registerUser = require('../services/registerService');

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('config');
jest.mock('express-validator');
jest.mock('../models/User');

/**
 * Tests for the registerUser function.
 */
describe('registerUser', () => {
    let req, res;

    // Set up test environment before each test case
    beforeEach(() => {
        req = {
            body: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@example.com',
                password: 'password123',
                apartment: {
                    country: 'Country',
                    region: 'Region',
                    city: 'City',
                    rooms: 2,
                    bathrooms: 2,
                    pictures: ['pic1.jpg', 'pic2.jpg'],
                },
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    // Reset mocks after each test case
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test case: should return 400 if validation errors exist
    test('should return 400 if validation errors exist', async () => {
        // Mock the validation result to indicate errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => false,
            array: () => [{ msg: 'Invalid email' }],
        });

        // Call the registerUser function
        await registerUser(req, res);

        // Assertions
        expect(validationResult).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Invalid email' }] });
    });

    // Test case: should return 400 if user already exists
    test('should return 400 if user already exists', async () => {
        // Mock the validation result to indicate no errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to return a user with the same email
        User.findOne.mockResolvedValueOnce({ email: req.body.email });

        // Call the registerUser function
        await registerUser(req, res);

        // Assertions
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists' });
    });

    // Test case: should create a new user, encrypt password, save to database, and return JWT token
    test('should create a new user, encrypt password, save to database, and return JWT token', async () => {
        // Mock the validation result to indicate no errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to return null (user does not exist)
        User.findOne.mockResolvedValueOnce(null);

        // Mock bcrypt, jwt, and config dependencies
        const salt = 'salt';
        const hashedPassword = 'hashedPassword';
        const jwtToken = 'generatedToken';
        bcrypt.genSalt.mockResolvedValueOnce(salt);
        bcrypt.hash.mockResolvedValueOnce(hashedPassword);
        jwt.sign.mockImplementationOnce((payload, secret, options, callback) => {
            callback(null, jwtToken);
        });

        // Call the registerUser function
        await registerUser(req, res);

        // Assertions
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, salt);
        expect(User).toHaveBeenCalledWith({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            apartment: {
                country: req.body.apartment.country,
                region: req.body.apartment.region,
                city: req.body.apartment.city,
                rooms: req.body.apartment.rooms,
                bathrooms: req.body.apartment.bathrooms,
                pictures: req.body.apartment.pictures,
            },
        });
    });

    // Test case: should handle server error
    test('should handle server error', async () => {
        // Mock the validation result to indicate no errors
        validationResult.mockReturnValueOnce({
            isEmpty: () => true,
        });

        // Mock the User.findOne method to throw an error
        User.findOne.mockRejectedValueOnce('Database error');

        // Call the registerUser function
        await registerUser(req, res);

        // Assertions
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});
