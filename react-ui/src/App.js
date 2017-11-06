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
  constructor(props) {
    super(props);

    this.state = {
      allPolls: allPolls,
      myPolls: [],
      selectedPoll: null,
      newPollInput: false
    }
  }

  // COnvert this to a component ?
  pollDisplay = (() => {
    if (this.state.selectedPoll) {
      return (
        <div>
          <h3 className="sect-title">Poll</h3>
          <Poll poll={this.state.selectedPoll}/>
        </div>
      );
    } else if (this.state.newPollInput) {
      return (
        <div>
          <h3 className="sect-title">New Poll</h3>
          <NewPoll />
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  });

  render() {
    return (
      <div className="App container">
        <h1 className="text-center">Voting App</h1>

        <div className="text-center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.setState({selectedPoll: null, newPollInput: true})}>
            Add Poll
          </button>
          <button type="button" className="btn btn-primary">Log in</button> / welcome user
        </div>

        {this.pollDisplay()}

        <h3 className="sect-title">All Polls</h3>
        <PollList
          polls={this.state.allPolls}
          onPollSelect={selectedPoll => this.setState({selectedPoll: selectedPoll, newPollInput: false})}
          key="allPolls" />

        <h3 className="sect-title">My Polls</h3>
        <PollList polls={this.state.myPolls} key = "myPolls" />

        <Footer />
      </div>
    );
  }
}

export default App;
