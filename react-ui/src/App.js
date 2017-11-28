import React, { Component } from 'react';
import './App.css';

import Poll from './components/poll';
import NewPoll from './components/new_poll';
import PollList from './components/poll_list';
import Footer from './components/footer';

const fetchHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allPolls: null,//allPolls, // !!! Sohuld be []
      myPolls: null,//myPolls, // !!! should be []
      selectedPoll: null,
      newPollInput: false,
      authenticated: false
    };
  }

  componentDidMount() {
    
    this.getAllPolls();

    this.getLoggedIn();
  }

  vote(question, answer) {
    console.log("Vote! Q: " + question + " A: " + answer);
    const url = "/api/vote?q=" + question + "&a=" + answer;
    fetch(url, {method: 'put', headers: fetchHeaders})
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
        headers: fetchHeaders,
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
    fetch("/api/getpoll", {headers: fetchHeaders})
    .then(results => {
      return results.json();
    }).then( data => {
      if (data.error) {
        alert(data.error)
      } else {
        this.setState({allPolls: data});
        // update poll display
        if (this.state.selectedPoll) {
          const selectedQ = this.state.selectedPoll.question;
          fetch("/api/getpoll?q=" + selectedQ, {headers: fetchHeaders})
          .then(results => {
            return results.json();
          }).then( data => {
            if (data.error) {
              alert(data.error)
            } else {
              this.setState({selectedPoll: data});
            }
          });
        }
      }
    });
  }

  pollDisplay = (() => {
    if (this.state.selectedPoll) {
      return (
        <div>
          <h3 className="sect-title" id="poll">Poll</h3>
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

  getLoggedIn () {
    fetch("/api/loggedIn", {headers: fetchHeaders, credentials: 'include'})
    .then(results => {
      return results.json();
    }).then( data => {
      if (data.error) {
        alert(data.error)
      } else {
        this.setState({authenticated: (data.authenticated == 'true')});

      }
    });
  }

  render() {
    return (
      <div className="App container">
        <div className="row">
          <div className="col"></div>
          <div className="col-md-12 col-lg-8">
            <h1 className="text-center">Voting App</h1>



            {
              this.state.authenticated
              ? (
                <div className="text-center">
                  <div>Welcome</div>
                  <button
                    type="button"
                    className="btn btn-primary btn-normal"
                    onClick={() => this.setState({selectedPoll: null, newPollInput: true})}>
                    Add Poll
                  </button>
                  /* !!!Logout button? */
                </div>)
              : (
                <div className="text-center">
                  <a className="btn btn-primary btn-normal btn-login" href="/auth/facebook">Log in - Facebook</a>
                  <a className="btn btn-primary btn-normal btn-login" href="/auth/twitter">Log in - Twitter</a>
                  <a className="btn btn-primary btn-normal btn-login" href="/auth/github">Log in - Github</a>
                </div>
              )
            }

            {this.pollDisplay()}

            <h3 className="sect-title">All Polls</h3>
            <PollList
              polls={this.state.allPolls}
              onPollSelect={selectedPoll => this.setState({selectedPoll: selectedPoll, newPollInput: false})}
              key="allPolls" />

            {!!this.state.myPolls
              ? (
                <div>
                  <h3 className="sect-title">My Polls</h3>
                  <PollList
                    polls={this.state.myPolls}
                    onPollSelect={poll => this.setState({selectedPoll: poll, newPollInput: false})}
                    onPollDelete={poll => this.deletePoll(poll)}
                    key="myPolls" />
                </div>
                )
              : null }
            </div>
            <div className="col"></div>
          </div>
        <Footer />
      </div>
    );
  }
}

export default App;
