var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var User = require('../models/user');
var init = require('./init');

// Get process.env from .env file if it exists
require('dotenv').config();


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      name: profile.displayName,
      someID: profile.id,
      provider: profile.provider
    };

    var updates = {
      name: profile.displayName,
      someID: profile.id,
      provider: profile.provider
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
init();


module.exports = passport;
