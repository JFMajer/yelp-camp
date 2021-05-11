const mongoose = require('mongoose');
const Campground = require('./campground');

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number
})

module.exports = mongoose.model('Review', reviewSchema);