const express = require('express');
const router = express.Router({ mergeParams: true });

const {reviewSchema} = require('../schemas');

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

//post a review
router.post('/', validateReview, catchAsync(async (req, res) => {
    //console.log(req.params.id)
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Review posted!');
    res.redirect(`/campgrounds/${camp._id}`);
}))

//delete single review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    console.log(req.params);
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review removed!');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;