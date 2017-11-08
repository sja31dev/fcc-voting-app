import React, { Component } from 'react';

class NewPoll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      question: '',
      answers: [{answer: ''} , {answer: ''}] // Start with two answers
    };
  }

  onAddAnswer() {
    const newAnswers = this.state.answers.concat([{ answer: ''}]);
    this.setState({answers: newAnswers});
  }

  onSubmitNewPoll() {
    const answers = this.state.answers.map((a) => {return a.answer});
    this.props.onSubmitNewPoll(this.state.question, answers);
  }

  onCancelNewPoll() {
    this.props.onCancelNewPoll();
  }

  onQuestionChange(question) {
    this.setState({question}); // Sets state key question to value question
  }

  onAnswerChange(idx, newAnswer) {
    const newAnswers = this.state.answers.map((answer, sidx) => {
      if (idx !== sidx) return answer;
      return { ...answer, answer: newAnswer };
    });
    this.setState({ answers: newAnswers });
  }

  onDeleteAnswer(idx) {
    console.log(idx);
    const newAnswers = this.state.answers.filter((s, sidx) => idx !== sidx);
    this.setState({ answers: newAnswers });
  }

  render() {
    const answers = this.state.answers.map((answer, idx) => {
      return (
        <div className="input-group" key={answer+idx}>
          <input
            type="text"
            className="form-control"
            id={"answer"+(idx+1)}
            placeholder={"Answer "+(idx+1)}
            value={answer.answer}
            onChange={event => this.onAnswerChange(idx, event.target.value)}/>
          <span className="input-group-btn">
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => this.onDeleteAnswer(idx)}>
              x
            </button>
          </span>
        </div>
      );
    });

    return (
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label htmlFor="question" className="col-form-label">Question</label>
              <input
                type="text"
                className="form-control"
                id="question"
                placeholder="Question"
                value={this.state.question}
                onChange={event => this.onQuestionChange(event.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="answer1" className="col-form-label">
                Answers
                <button type="button" className="btn btn-primary btn-normal" onClick={() => this.onAddAnswer()}>Add Answer</button>
              </label>
              {answers}
            </div>
            <button type="button" className="btn btn-danger btn-normal" onClick={() => this.onCancelNewPoll()}>Cancel</button>
            <button type="button" className="btn btn-primary btn-normal" onClick={() => this.onSubmitNewPoll()}>Create Poll</button>
          </form>
        </div>
      </div>
    );
  }

}

export default NewPoll;
