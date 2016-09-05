'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Going = new Schema({
    bar_id: String,
    user: String,
});

module.exports = mongoose.model('Going', Going);