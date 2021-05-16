const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

//all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', { allCamps });
}))

//create new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))

//show one specific campground
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await (await Campground.findById(req.params.id).populate('reviews'));
    res.render('campgrounds/show', { campground });
}))

//edit campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    console.log(req.body);
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete campground
router.delete('/:id', catchAsync(async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
}))


module.exports = router;