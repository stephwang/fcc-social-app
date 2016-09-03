'use strict';

var path = process.cwd();
var SearchHandler = require(path + '/app/controllers/searchHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	var searchHandler = new SearchHandler();
	
	// general routes
	app.route('/')
		.get(function (req, res) {
			res.render(path + '/public/index.ejs', { 
				isAuthed: req.isAuthenticated(),
				user: req.user
			});
		});

	app.route('/login')
		.get(function (req, res) {
			res.render(path + '/public/login.ejs');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
		
	// search
	app.route('/search')
		.get(searchHandler.saveSearch, searchHandler.getSearchResults);
		
	// auth routes
	app.route('/auth/google')
		.get(passport.authenticate('google', { scope : ['profile'] }));

	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

};
