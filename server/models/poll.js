var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var answer = new Schema({answer: String, votes: { type: Number, default: 0 }}, { _id: false });

// create Poll Schema
var Poll = new Schema({
  question: String,
  answer: [answer],
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Poll', Poll);
