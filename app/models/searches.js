'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Search = new Schema({
    user: String,
    query: String,
});

module.exports = mongoose.model('Search', Search);