import React, { Component } from 'react';
import './App.css';

import Poll from './components/poll';
import NewPoll from './components/new_poll';
import PollList from './components/poll_list';
import Footer from './components/footer';

const allPolls = [
  {
    "question": "Where am I?",
    "answer": [
      {
        "answer": "here",
        "votes": 2
      },
      {
        "answer": "there",
        "votes": 1
      },
      {
        "answer": "nowhere",
        "votes": 4
      },
      {
        "answer": "there too",
        "votes": 6
      }
    ]
  },
  {
    "question": "Where am I now?",
    "answer": [
      {
        "answer": "here",
        "votes": 1
      },
      {
        "answer": "there",
        "votes": 2
      },
      {
        "answer": "everywhere",
        "votes": 3
      }
    ]
  }
];

class App extends Component {

  render() {
    return (
      <div className="App container">
        <h1>Voting App</h1>

        <h3>New Poll</h3>
        <NewPoll />

        <h3>Poll</h3>
        <Poll poll={allPolls[0]}/>

        <h3>My Polls</h3>
        <PollList polls={allPolls} />

        <h3>All Polls</h3>
        <PollList polls={allPolls} />

        <Footer />
      </div>
    );
  }
}

export default App;
