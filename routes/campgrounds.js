const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
//const upload = multer({ dest: 'uploads/' });

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


var crypto = require("crypto");
//var id = crypto.randomBytes(20).toString('hex');
const getBlobName = () => {
    return crypto.randomBytes(20).toString('hex');
}
// const getBlobName = originalName => {
//     // Use a random number to generate a unique file name, 
//     // removing "0." from the start of the string.
//     const identifier = Math.random().toString().replace(/0\./, ''); 
//     return `${identifier}-${originalName}`;
//   };

const resolveMetadata = (req, file) => {
    return new Promise((resolve, reject) => {
        const metadata = yourCustomLogic(req, file);
        resolve(metadata);
    });
};

const azureStorage = new MulterAzureStorage({
    connectionString: process.env.AZURE_STORAGE_ACCOUNT_CONNECTION_STRING,
    accessKey: process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY,
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    containerName: 'uploads',
    blobName: getBlobName,
    //metadata: resolveMetadata,
    containerAccessLevel: 'blob',
    urlExpirationTime: 60
});

const upload = multer({
    storage: azureStorage
});




router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.any('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req, res, next) => {
    //     console.log(req.files);
    //     res.status(200).json(req.files);
    // })


//create new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampgroundPost))

//edit campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampgroundForm));

module.exports = router;