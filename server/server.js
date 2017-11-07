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
  res.json({test:"test"});
});

const mapPollToJSON = ((p) => {
  var answer = p.answer.map((a) => {
    return {"answer": a.answer, "votes": a.votes};
  });
  return {"question": p.question, "answer": answer, "id": p._id};
});

app.get('/api/getpoll', function(req, res) {
  if (req.query.q) {
    Poll.find({"question": req.query.q}, function (err, polls) {
      if (err) {
        res.json({"error": "Internal server error"});
        return console.error(err);
      }
      if (polls.length !== 1) {
        res.json({error:"Poll not found."});
      } else {
        res.json(mapPollToJSON(polls[0]));
      }
    });
  } else {
    // Get all polls (or limit to a certain number)
    Poll.find(function (err, polls) {
      if (err) {
        res.json({"error": "Internal server error"});
        return console.error(err);
      }
      res.json(polls.map((p) => mapPollToJSON(p)));
    });
  }
});

app.put('/api/newpoll', function(req, res) {
  if (req.body && req.body.question && req.body.answer) {
    // !!! Check if the user is authenticated

    // Check if the question was already in the database
    Poll.find({"question": req.body.question}, function (err, polls) {
      if (err) {
        res.json({"error": "Internal server error"});
        return console.error(err);
      }
      console.log(polls);
      if (polls.length !== 0) {
        res.json({error:"That question already exists."});
      } else if (req.body.answer < 2) {
        res.json({error:"At lease two answers must be defined."});
      } else {
        var answer = req.body.answer.map((a) => {
          return {
            "answer": a,
            "votes": 0
          };
        });
        var newPoll = new Poll({
          "question": req.body.question,
          "answer": answer
        });
        newPoll.save(function (err, poll) {
          if (err) {
            res.json({"error": "Internal server error"});
            return console.error(err);
          }
          res.json({"question": poll.question, "answer": poll.answer});
        });
      }
    });
  } else {
    res.json({error:"Error processing request."});
  }
});

app.put('/api/addanswer', function(req, res) {
/*  console.log(req);*/
  Poll.findOneAndUpdate(
    { // conditions
      "question": req.query.q
    },
    { // update
        "$addToSet": { "answer": {"answer": req.query.a, "votes": 0} }
    },
    { // options
      "new": true // Return the updated document
    },
    function (err, poll)
    {
      if (err) {
        res.json({"error": "Internal server error"});
        return console.error(err);
      }
      if (!poll) {
        res.json({"error": "Question not found."});
      } else {
        res.json({"question": poll.question, "answer": poll.answer});
      }
    }
  );
});

app.put('/api/vote', function(req, res) {
/*  console.log(req);*/
  Poll.findOneAndUpdate(
    { // conditions
      "question": req.query.q,
      "answer.answer": req.query.a
    },
    { // update
        "$inc": { "answer.$.votes": 1 }
    },
    { // options
      "new": true // Return the updated document
    },
    function (err, poll)
    {
      if (err) {
        res.json({"error": "Internal server error"});
        return console.error(err);
      }
      if (!poll) {
        res.json({"error": "Answer not found."});
      } else {
        res.json({"question": poll.question, "answer": poll.answer});
      }
    }
  );
});

app.delete('/api/delete', function(req, res) {
  // !!! Check if the user is authenticated and it's their poll
  Poll.findOneAndRemove({"question": req.query.q}, function (err, poll) {
    if (err) {
      res.json({"error": "Internal server error"});
      return console.error(err);
    }
    if (!poll) {
      res.json({error:"Poll not found."});
    } else {
      res.json(mapPollToJSON(poll));
    }
  });
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
/*app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'views', 'index.html'));
});*/

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`);
});
