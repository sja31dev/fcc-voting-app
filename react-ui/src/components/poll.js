import React from 'react';
//import Line from 'react-chartjs
import {Doughnut} from 'react-chartjs-2';

const colors = [
  "#4D4D4D",// (gray)
  "#5DA5DA",// (blue)
  "#FAA43A",// (orange)
  "#60BD68",// (green)
  "#F17CB0",// (pink)
  "#B2912F",// (brown)
  "#B276B2",// (purple)
  "#DECF3F",// (yellow)
  "#F15854",// (red)
];



const Poll = ({poll, onVoteSelect}) => {
  const labels = poll.answer.map((answer) => {
    return answer.answer;
  });

  const data = poll.answer.map((answer) => {
    return answer.votes;
  });

  const backgroundColor = poll.answer.map((answer, idx) => {
    return colors[idx % colors.length];
  });

  const chartData = {
        labels: labels,
        datasets: [{
            label: "My First dataset",
            data: data,
            backgroundColor: backgroundColor
        }]
    };

  const chartOptions = {
    legend: {position:'bottom'}
  };

  const votingOptions = poll.answer.map((answer) => {
    return (
      <li
        className="list-group-item poll-answer-vote"
        onClick={() => onVoteSelect(poll.question, answer.answer)}
        key={answer.answer}>
        {answer.answer}
      </li>
    );
  });

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{poll.question}</h4>
        <div className="row">
          <div className="col-md-8">
            <Doughnut data={chartData} options={chartOptions} style={{"maxWidth": "400px"}} />
          </div>
          <div className="col-md-4 vote-panel">
            <h6>Select answer to vote for:</h6>
            <ul className="list-group">
              {votingOptions}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Poll;
