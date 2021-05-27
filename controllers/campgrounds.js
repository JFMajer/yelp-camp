const Campground = require('../models/campground');


//show all campgrounds
module.exports.index = async (req, res) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', { allCamps });
};

//create new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    console.log(req.files);
    const campground = new Campground(req.body.campground);
    for (img of req.files) {
        //console.log(img.url, img.blobName);
        campground.images.push({url: 'https://testuploadfiles.blob.core.windows.net/uploads/'.concat(img.blobName) , blobname: img.blobName});
    }
    //console.log(campground.images);
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

//show one specific campground
module.exports.showCampground = async (req, res) => {
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
};

//edit campground
module.exports.editCampgroundForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
};

module.exports.editCampgroundPost = async (req, res) => {
    console.log(req.body.campground);
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

//delete campground
module.exports.deleteCampground = async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
};

