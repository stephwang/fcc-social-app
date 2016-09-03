'use strict';

var Search = require('../models/searches.js');
var Yelp = require('yelp');

function SearchHandler () {
    
    var yelp = new Yelp({
      consumer_key: process.env.YELP_KEY,
      consumer_secret: process.env.YELP_SECRET,
      token: process.env.YELP_TOKEN,
      token_secret: process.env.YELP_TOKEN_SECRET,
    });
    
    var self = this;
    
    this.getSearchResults = function(req, res){
        // if first loading the page or location not provided
        if (req.query.location == ''){
            // if user is logged in, we can get their last search
            if (req.isAuthenticated()) {
                console.log("user is logged in - looking for their last search");
                self.getLastSearch(req, res);
            }
            // if not logged in, return nothing
            else {
                console.log("user is not logged in - just sending back null");
                res.send(null);
            }
        } else {
            self.executeSearch(req.query.location, res);
        }
    };
    
    this.executeSearch = function(location, res){
        // execute the search if we have a query
        if(location){
            console.log("we got " + location + " as search query.");
            yelp.search({ term: 'bars', location: location, limit: 15 })
                .then(function (data) {
                    data.query = location;
                    res.send(data);
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
    };
    
    this.getLastSearch = function(req, res){
        Search.findOne({ user: req.user.google.id }, function(err, search){
            if(err) throw err;
            console.log("using last search of " + search.query);
            self.executeSearch(search.query, res);
        });
    };
	
	this.saveSearch = function(req, res, next) {
	    // save if the user is authenticated and a location is provided
	    if(req.isAuthenticated() && req.query.location != ''){
    	    Search.update(
                {user: req.user.google.id}, 
                {user: req.user.google.id, query: req.query.location }, 
                {upsert: true}, 
                function(err) {
                    if(err) throw err;
                    else console.log('added search: ' + req.user.google.name + ', ' + req.query.location);
                }
            );
	    }
	    else {
	        console.log("no search saved. isAuthed:" + req.isAuthenticated() + ", location:" + req.query.location);
	    }
        next();
	};

}

module.exports = SearchHandler;
