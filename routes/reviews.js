const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


//post a review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    console.log(req.body.review)
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Review posted!');
    res.redirect(`/campgrounds/${camp._id}`);
}))

//delete single review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    console.log(req.params);
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review removed!');
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;