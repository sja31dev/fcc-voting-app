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
const myPolls = [

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
      allPolls: null,//allPolls, // !!! Sohuld be []
      myPolls: null,//myPolls, // !!! should be []
      selectedPoll: null,
      newPollInput: false
    }
  }

  componentDidMount() {
    console.log("did mount");

    this.getAllPolls();
  }

  vote(question, answer) {
    console.log("Vote! Q: " + question + " A: " + answer);
    const url = "/api/vote?q=" + question + "&a=" + answer;
    fetch(url, {method: 'put'})
    .then(results => {
      return results.json();
    }).then( data => {
      if (data.error) {
        alert(data.error)
      } else {
        this.getAllPolls();
      }
    });
  }

  newPoll(question, answers) {
    console.log("New Poll! Q: " + question + " A: " + answers);
    console.log(JSON.stringify({
      question: question,
      answer: answers
    }));
    fetch('/api/newpoll',
      {
        method: 'put',
        body: JSON.stringify({
          question: question,
          answer: answers
        })
      })
    .then(results => {
      return results.json();
    }).then( data => {
      if (data.error) {
        alert(data.error)
      } else {
        this.setState({newPollInput: false})
        this.getAllPolls();
      }
    });
  }

  deletePoll(poll) {
    console.log("Delete! Q: " + poll.question);
  }

  getAllPolls () {
    fetch("/api/getpoll")
    .then(results => {
      return results.json();
    }).then( data => {
      if (data.error) {
        alert(data.error)
      } else {
        this.setState({allPolls: data});
        // update poll display
        if (this.state.selectedPoll && this.state.allPolls) {
          for (var i = 0; i < this.state.allPolls.length; i++) {
            if (this.state.selectedPoll.question === this.state.allPolls[i].question) {
              this.setState({selectedPoll: this.state.allPolls[i]});
              break;
            }
          }
        }
      }
    });
  }

  // COnvert this to a component ?
  pollDisplay = (() => {
    if (this.state.selectedPoll) {
      return (
        <div>
          <h3 className="sect-title">Poll</h3>
          <Poll
            poll={this.state.selectedPoll}
            onVoteSelect={(question, answer) => this.vote(question, answer)} />
        </div>
      );
    } else if (this.state.newPollInput) {
      return (
        <div>
          <h3 className="sect-title">New Poll</h3>
          <NewPoll
            onSubmitNewPoll={(question, answers) => this.newPoll(question, answers)}
            onCancelNewPoll={() => this.setState({newPollInput: false})}/>
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
        <PollList
          polls={this.state.myPolls}
          onPollSelect={poll => this.setState({selectedPoll: poll, newPollInput: false})}
          onPollDelete={poll => this.deletePoll(poll)}
          key="myPolls" />

        <Footer />
      </div>
    );
  }
}

export default App;
