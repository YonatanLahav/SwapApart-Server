const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Plan = require('../../models/Plan');
const Swipe = require('../../models/Swipe');
const User = require('../../models/User');

// @route   GET api/plans
// @desc    Get all plans of the user.
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const plans = (await User.findById(req.user.id).populate('plans')).plans
        res.json(plans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/plans
// @desc    Add new plan to the user.
// @access  Private
router.post('/', auth, async (req, res) => {
    const { startDate, endDate, country, region, city, minRoomsNum, minBathroomsNum } = req.body;
    try {
        const newPlan = new Plan({
            userId: req.user.id,
            startDate,
            endDate,
            country,
            region,
            city,
            minRoomsNum,
            minBathroomsNum
        });

        const plan = await newPlan.save();

        // Add the plan id to the user's plans array
        const user = await User.findByIdAndUpdate(req.user.id, { $push: { plans: plan.id } }, { new: true });

        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/plans/:id
// @desc    Update plan by plan ID.
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

// @route   DELETE api/plans/:id
// @desc    Delete plan
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let plan = await Plan.findById(req.params.id);

        if (!plan) return res.status(404).json({ msg: 'Plan not found' });

        // Make sure user owns plan
        if (plan.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Plan.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Plan removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/plans/optional/:id
// @desc    Get all optional plans for matching.
// @access  Private
router.get('/optional/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const plan = await Plan.findById(req.params.id)
        const startDateRange = new Date(plan.startDate);
        startDateRange.setDate(startDateRange.getDate() - 1);
        const endDateRange = new Date(plan.endDate);
        endDateRange.setDate(endDateRange.getDate() + 1);

        const excludedPlanIds = await Swipe.distinct('swipedPlan', {
            swiperPlan: plan.id,
        });

        console.log(excludedPlanIds)
        const plans = await Plan.find({
            $and: [
                { startDate: { $gte: startDateRange } },
                { endDate: { $lte: endDateRange } },
                { userId: { $ne: user._id } },
                { country: user.apartment.country },
                { region: user.apartment.region },
                { minRoomsNum: { $gte: user.apartment.rooms } },
                { minBathroomsNum: { $gte: user.apartment.bathrooms } },
                { _id: { $nin: excludedPlanIds } },
            ]
        }).populate('userId', 'apartment');
        const data = plans.filter((p) =>
            p.userId.apartment.country == plan.country
            && p.userId.apartment.region == plan.region
            && p.userId.apartment.rooms >= plan.minRoomsNum
            && p.userId.apartment.bathrooms >= plan.minBathroomsNum)
        // console.log(user);
        console.log(data)
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
