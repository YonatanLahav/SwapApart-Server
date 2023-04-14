// /routes/api/users.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route    GET api/users
// @desc     Get user.
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route    GET api/users/:id
// @desc     Get user by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   PUT api/users
// @desc    Update user.
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { startDate, endDate, country, region, city, minRoomsNum, minBathroomsNum } = req.body;

    // Build plan object
    const planFields = {};
    if (startDate) planFields.startDate = startDate;
    if (endDate) planFields.endDate = endDate;
    if (country) planFields.country = country;
    if (region) planFields.region = region;
    if (city) planFields.city = city;
    if (minRoomsNum) planFields.minRoomsNum = minRoomsNum;
    if (minBathroomsNum) planFields.minBathroomsNum = minBathroomsNum;

    try {
        let plan = await Plan.findById(req.params.id);

        if (!plan) return res.status(404).json({ msg: 'Plan not found' });

        // Make sure user owns plan
        if (plan.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        plan = await Plan.findByIdAndUpdate(
            req.params.id,
            { $set: planFields },
            { new: true }
        );

        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
