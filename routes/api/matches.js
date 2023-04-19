// Import required modules
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Plan = require('../../models/Plan');
const Swipe = require('../../models/Swipe');
const User = require('../../models/User');
const Match = require('../../models/Match');

// @route   GET api/matches
// @desc    Get all Matches of the user.
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const plansIds = user.plans;
        const matches = await Match.find({ plans: { $in: plansIds } }).populate('plans');
        const data = await Promise.all(matches.map(async (match) => {
            const plainMatch = match.toObject();
            const plan = plainMatch.plans.find(p => p.userId == req.user.id);
            const matchedUser = (await Plan.findOne({ userId: { $ne: req.user.id } })
                .populate('userId')).userId
            const matchedUserData = {
                firstName: matchedUser.firstName,
                lastName: matchedUser.lastName,
                apartment: matchedUser.apartment
            };
            plainMatch.plan = plan;
            plainMatch.matchedUser = matchedUserData;
            delete plainMatch.plans;
            return plainMatch;
        }))
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
