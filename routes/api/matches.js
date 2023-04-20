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
        const matches = await Match.find({ plans: { $in: plansIds } })
            .populate('plans')
            .populate('lastMessage')
            .sort({ lastUpdate: -1 });
        const data = await Promise.all(matches.map(async (match) => {
            const plainMatch = match.toObject();
            const plan = plainMatch.plans.find(p => p.userId == req.user.id);
            const matchedPlan = await Plan.findOne({
                _id: { $in: match.plans },
                userId: { $ne: req.user.id }
            }).populate('userId');
            // const matchedUser = (await Plan.findOne({ userId: { $ne: req.user.id } })
            //     .populate('userId')).userId
            const matchedUser = {
                firstName: matchedPlan.userId.firstName,
                lastName: matchedPlan.userId.lastName,
                apartment: matchedPlan.userId.apartment
            };

            plainMatch.plan = plan;
            plainMatch.matchedUser = matchedUser;
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
