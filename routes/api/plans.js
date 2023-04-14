const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Plan = require('../../models/Plan');

// @route   GET api/plans
// @desc    Get all plans of the auth user.
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.user.id });
        res.json(plans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/plans
// @desc    Add new plan to the auth user.
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

module.exports = router;
