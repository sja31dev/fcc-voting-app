var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');
var init = require('./init');

// Get process.env from .env file if it exists
require('dotenv').config();

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_ID,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK
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

    // update the user if they exists or add a new user
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
