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
	
	function loginRedirect (req, res, next) {
		if (req.isAuthenticated()){
			return next();
		} else {
			res.send({redirect: '/login'});
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
		
	// search results
	app.route('/api/search')
		.get(searchHandler.saveSearch, searchHandler.getSearchResults);
		
	// number of people going
	app.route('/api/goingdata')
		.get(searchHandler.getGoingData);
		
	// indicate user is going
	app.route('/api/going')
		.get(loginRedirect, searchHandler.addGoing);
		
	// indicate user is not going
	app.route('/api/notgoing')
		.get(loginRedirect, searchHandler.removeGoing);

		
	// auth routes
	app.route('/auth/google')
		.get(passport.authenticate('google', { scope : ['profile'] }));

	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

};
