const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var passportGithub = require('./auth/github');
var passportTwitter = require('./auth/twitter');
var passportFacebook= require('./auth/facebook');

var User = require('./models/user');
var Poll = require('./models/poll');


// Get process.env from .env file if it exists
require('dotenv').config();

const app = express();
// Set port to use if env doesnt set one
const PORT = process.env.PORT || 5000;

var Schema = mongoose.Schema;

// API
app.use(bodyParser.json());
app.get('/api/test', function(req, res) {
  console.log(req);
  /*Poll.find(function (err, polls) {
    if (err) return console.error(err);
    console.log(polls);
    res.json({test:"test"});
  });*/
  res.json({test:"test"});
});
app.get('/api/getpoll', function(req, res) {
  //console.log(req);
  // !!! query a particular poll or get all or all for one user
  if (req.query.q) {
    Poll.find(function (err, polls) {
      if (err) return console.error(err);
      console.log(polls);
      res.json({test:"getpoll","question":req.query.q});
    });
  } else {
    // Get all polls (or limit to a certain number)
    Poll.find(function (err, polls) {
      if (err) return console.error(err);
      console.log(polls);
      res.json({test:"getpoll"});
    });
  }
});
app.put('/api/newpoll', function(req, res) {
  console.log(req);
  /*Poll.find(function (err, polls) {
    if (err) return console.error(err);
    console.log(polls);
    res.json({test:"test"});
  });*/
  res.json({test:"newpoll","question":req.body.question,"answer":req.body.answer});
});
app.put('/api/vote', function(req, res) {
  console.log(req);
  /*Poll.find(function (err, polls) {
    if (err) return console.error(err);
    console.log(polls);
    res.json({test:"test"});
  });*/
  res.json({test:"vote","question":req.body.question,"answer":req.body.vote});
});
app.delete('/api/delete', function(req, res) {
  console.log(req);
  /*Poll.find(function (err, polls) {
    if (err) return console.error(err);
    console.log(polls);
    res.json({test:"test"});
  });*/
  res.json({test:"delete","question":req.body.question});
});
// !!! user is authenticated

// USER AUTHINTICATION
// express-session and passport middleware
app.use(session({
  secret: 'iowhefiysdg0wpiej',
  resave: true,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
    max: 100 // Maximum 100 entries
  }),
}));
app.use(passport.initialize());
app.use(passport.session());

// *** mongoose *** //
//mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

// ROUTES

//GITHUB
app.get('/auth/github', passportGithub.authenticate('github', { scope: [ 'user:email' ] }));
app.get('/auth/github/callback',
  passportGithub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // Explicitly save the session before responding! (see https://github.com/jaredhanson/passport/issues/482)
    req.session.save(() => {
      res.json(req.user);
    });
  });

//TWITTER
app.get('/auth/twitter', passportTwitter.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // Explicitly save the session before responding! (see https://github.com/jaredhanson/passport/issues/482)
    req.session.save(() => {
      res.json(req.user);
    });
  });

//FACEBOOK
app.get('/auth/facebook', passportFacebook.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // Explicitly save the session before responding! (see https://github.com/jaredhanson/passport/issues/482)
    req.session.save(() => {
      res.json(req.user);
    });
  });

app.get('/login', function(req, res, next) {
  res.send('Go back and register!');
});

app.get('/test', function(req, res) {
  res.sendFile(process.cwd() + '/server/views/index.html');
});


// END OF USER AAUTHENTICATION

// Static files
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

// Remaining requests return the React app
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
