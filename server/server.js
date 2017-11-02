const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

var passportGithub = require('./auth/github');
var passportTwitter = require('./auth/twitter');
var passportFacebook= require('./auth/facebook');

// Get process.env from .env file if it exists
require('dotenv').config();

const app = express();
// Set port to use if env doesnt set one
const PORT = process.env.PORT || 5000;

var Schema = mongoose.Schema;

// API
app.get('/api', function(req, res) {
  res.json({"error":"No API functionality defined yet"});
});

// USER AUTHINTICATION
// express-session and passport middleware
app.use(session({
  secret: 'iowhefiysdg0wpiej',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// *** mongoose *** //
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

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
  console.log(process.env.TWITTER_CALLBACK);
});
