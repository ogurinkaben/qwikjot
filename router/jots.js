const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../helpers/auth');
require('../models/Jot');
const mongoose = require('mongoose');
const Jot = mongoose.model('jots');
router.get('/add', ensureAuth, (req, res) => {
	res.render('jots/add');
});
router.get('/edit/:id', ensureAuth, (req, res) => {
	Jot.findOne({
			_id: req.params.id
		})
		.lean()
		.then(jot => {
			if (jot.user !== req.user.id) {
				req.flash('error_msg', "Come on! That's not yours!");
				res.redirect('/jots')
			} else {
				res.render('jots/edit', {
					jot: jot
				});
			}
		}).catch(err => {
			console.log(err)
		})
});
router.post('/', ensureAuth, (req, res) => {
	let errors = [];
	if (!req.body.title) {
		errors.push({
			msg: "Please add a title"
		});
	}
	if (!req.body.details) {
		errors.push({
			msg: "Please add some details"
		});
	}
	if (errors.length > 0) {
		res.render('jots/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	} else {
		const userJot = {
			title: req.body.title,
			details: req.body.details,
			user: req.user.id
		}
		new Jot(userJot)
			.save()
			.then(jots => {
				req.flash('success_msg', "Jot Added")
				res.redirect('/jots')
			})
	}
});
router.put('/:id', ensureAuth, (req, res) => {
	Jot.findOne({
			_id: req.params.id
		}).then(jot => {
			jot.title = req.body.title;
			jot.details = req.body.details;
			jot.save()
				.then(jot => {
					req.flash('success_msg', "Jot Updated")
					res.redirect('/jots')
				})
				.catch(err => {
					console.log(err)
				})
		})
		.catch(err => {
			console.log(err)
		})
});
router.delete('/:id', ensureAuth, (req, res) => {
	Jot.deleteOne({
			_id: req.params.id
		})
		.then(() => {
			req.flash('success_msg', "Jot Deleted")
			res.redirect('/jots');
		})
});
router.get('/', ensureAuth, (req, res) => {
	Jot.find({ user: req.user.id })
		.lean()
		.sort({
			date: 'desc'
		})
		.then(jots => {
			res.render('jots/index', {
				jots: jots
			});
		});
});
module.exports = router;
