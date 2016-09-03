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
    
    this.getSearchResults = function(req, res){
        yelp.search({ term: 'bars', location: req.query.location, limit: 10 })
            .then(function (data) {
                res.send(data);
            })
            .catch(function (err) {
                console.error(err);
            });
    };
    
    this.getSearch = function(req, res){
        Search.find({}, function(err, polls){
            if(err) throw err;
            res.json(polls);
        });
    };
	
	this.updateSearch = function(req, res) {
	    Search.update(
            {user: req.user.google.id}, 
            {user: req.user.google.id, query: req.query.location }, 
            {upsert: true}, 
            function(err) {
                if(err) throw err;
                else console.log('added search: ' + req.user.google.name + ', ' + req.query.location);
            }
        );
	};

}

module.exports = SearchHandler;
