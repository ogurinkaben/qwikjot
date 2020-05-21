module.exports = {
	ensureAuth: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash('error_msg', 'You need to login first');
			res.redirect('/user/login')
		}
	}
}
