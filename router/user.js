const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/User');
const User = mongoose.model('users');
router.get('/login', (req, res) => {
	res.render('auth/login');
});
router.get('/register', (req, res) => {
	res.render('auth/register');
});
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: `/jots`,
		failureRedirect: '/user/login',
		failureFlash: true,
	})(req, res, next);
});
router.post('/register', (req, res) => {
	let errors = [];
	if (req.body.password !== req.body.cPassword) {
		errors.push({
			msg: 'Passwords do not match'
		})
	}
	if (req.body.password.length < 5) {
		errors.push({
			msg: 'Password too short'
		})
	}
	if (errors.length > 0) {
		res.render('auth/register', {
			errors: errors,
			fullName: req.body.fullName,
			email: req.body.email,
			password: req.body.password,
			cPassword: req.body.cPassword,
		});
	} else {
		User.findOne({
			email: req.body.email.toLowerCase()
		}).then(user => {
			if (user) {
				req.flash('error_msg', 'Email Already Taken');
				res.redirect('/user/register')
			} else {
				const newUser = new User({
					fullName: req.body.fullName,
					email: req.body.email.toLowerCase(),
					password: req.body.password,
				})
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => {
								req.flash('success_msg', 'You are now registered');
								res.redirect('/user/login');
							})
							.catch(err => {
								console.log(err);
								return;
							})
					})
				})
			}
		})
	}
});
router.get('/logout', (req, res, next) => {
	req.logout();
	req.flash('success_msg', 'Logged Out');
	res.redirect('/user/login');
});
module.exports = router;
