const Review = require('../models/review');
const Campground = require('../models/campground');

//post a review
module.exports.reviewPost = async (req, res) => {
    console.log(req.body.review)
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Review posted!');
    res.redirect(`/campgrounds/${camp._id}`);
};

//delete single review
module.exports.reviewDelete = async (req, res) => {
    console.log(req.params);
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review removed!');
    res.redirect(`/campgrounds/${id}`);
};