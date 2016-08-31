'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();
	
	// general routes
	app.route('/')
		.get(function (req, res) {
			res.render(path + '/public/index.ejs', { 
				isAuthed: req.isAuthenticated()
			});
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
	
		
	// poll routes
	app.route('/poll/:pollid')
		.get(pollHandler.getOptionsList
			, pollHandler.getOptionsByCount
			, function(req, res){
			res.render(path + '/public/poll.ejs', {
				pollid: req.params.pollid,
			    options: req.params.options,
			    orderedOptions: req.params.orderedOptions,
			    isAuthed: req.isAuthenticated()
			});
		});
		
	app.route('/mypolls')
		.get(isLoggedIn
			, pollHandler.getUserPolls
			, function (req, res) {
			res.render(path + '/public/mypolls.ejs', {
				isAuthed: req.isAuthenticated(),
				myPolls: req.params.mypolls
			});
		});
	
	app.route('/newpoll')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/newpoll.ejs', {
				isAuthed: req.isAuthenticated()
			});
		});

	// submit new poll
	app.route('/submit-form')
		.get(isLoggedIn, pollHandler.addPollAndRedirect);
	
	// auth routes
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	// api routes
	app.route('/api/pollslist')
		.get(pollHandler.getPollsList);

	app.route('/api/user/:id')
		.get(function (req, res) {
			if(req.user){
				res.json(req.user.github);
			}
			else {
				res.json(null);
			}
		});
	
	app.route('/api/poll/:pollid')
		.get(pollHandler.addVote);
	
	app.route('/delete/:pollid')
		.get(pollHandler.deletePoll, function(req, res){ res.redirect('/') });
};
