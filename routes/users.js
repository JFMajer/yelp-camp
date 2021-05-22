const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { ref } = require('joi');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerPost))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),  users.loginPost)


router.get('/logout', users.logout);


module.exports = router;