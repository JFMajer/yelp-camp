const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


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

//views below
app.get('/', (req, res) => {
    res.render('home');
})