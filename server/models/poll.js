var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

// create User Schema
var Poll = new Schema({
  question: String,
  answer: [{answer: String, votes: Number}],
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('poll', Poll);
