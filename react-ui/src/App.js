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
    ],
    "id": 53
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
    ],
    "id": 99
  }
];

class App extends Component {

  render() {
    return (
      <div className="App container">
        <h1 className="text-center">Voting App</h1>

        <h3 className="sect-title">New Poll</h3>
        <NewPoll />

        <h3 className="sect-title">Poll</h3>
        <Poll poll={allPolls[0]}/>

        <h3 className="sect-title">My Polls</h3>
        <PollList polls={allPolls} key="myPolls" />

        <h3 className="sect-title">All Polls</h3>
        <PollList polls={allPolls} key = "allPolls" />

        <Footer />
      </div>
    );
  }
}

export default App;
