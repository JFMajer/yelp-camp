const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

//create new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampgroundPost))

//edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampgroundForm));

module.exports = router;