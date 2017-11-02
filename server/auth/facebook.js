var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
var init = require('./init');

// Get process.env from .env file if it exists
require('dotenv').config();


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
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
