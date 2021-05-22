const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


//post a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.reviewPost));

//delete single review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.reviewDelete));


module.exports = router;