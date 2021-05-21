const express = require('express');
const router = express.Router();
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const Campground = require('../models/campground');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


//all campgrounds
router.get('/', catchAsync(async (req, res) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', { allCamps });
}))

//create new campground
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
}))

//show one specific campground
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await (await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')));
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    //console.log(campground);
    res.render('campgrounds/show', { campground });
}))

//edit campground
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    console.log(req.body.campground);
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
}))


module.exports = router;