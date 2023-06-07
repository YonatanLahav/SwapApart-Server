// /routes/api/mathces.js

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Plan = require('../../models/Plan');
const User = require('../../models/User');
const Match = require('../../models/Match');

/**
 * @route   GET api/matches
 * @desc    Get all Matches of the user.
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.user.id);

        // Get the IDs of the user's plans
        const plansIds = user.plans;

        // Find all matches associated with the user's plans
        const matches = await Match.find({ plans: { $in: plansIds } })
            .populate('plans')
            .populate('lastMessage')
            .populate('messages')
            .sort({ lastUpdate: -1 });

        // Prepare the data to be sent in the response
        const data = await Promise.all(matches.map(async (match) => {
            const plainMatch = match.toObject();

            // Find the plan belonging to the current user in the match
            const plan = plainMatch.plans.find(p => p.userId == req.user.id);

            // Find the matched plan belonging to the other user in the match
            const matchedPlan = await Plan.findOne({
                _id: { $in: match.plans },
                userId: { $ne: req.user.id }
            }).populate('userId');

            // Extract the necessary information from the matched user's plan
            const matchedUser = {
                firstName: matchedPlan.userId.firstName,
                lastName: matchedPlan.userId.lastName,
                apartment: matchedPlan.userId.apartment
            };

            // Update the plainMatch object with the plan and matchedUser information
            plainMatch.plan = plan;
            plainMatch.matchedUser = matchedUser;
            delete plainMatch.plans;
            return plainMatch;
        }));

        // Send the response with the prepared data
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
