const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


//database connection
mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to the db...')
});
// --------------------------------------

app.listen(3000, () => {
    console.log('listening on port 3000...');
})


//---------------------------views below---------------------------------
app.get('/', (req, res) => {
    res.render('home');
})

//all campgrounds
app.get('/campgrounds', async (req, res) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', {allCamps});
})

//create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

//show one specific campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
})

//edit campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    console.log(req.body);
    res.redirect(`/campgrounds/${campground._id}`);
})

//delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect('/campgrounds');
})

