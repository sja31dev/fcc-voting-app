import React from 'react';

const PollListItem = ({poll, onPollSelect}) => {

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

  const totalVotes = poll.answer.reduce((acc, val) => {
    return acc + val.votes;
  }, 0);

  const pollBars = poll.answer.map((answer, idx) => {
    const color = colors[idx % colors.length];
    const percent = "" + (answer.votes * 100 / totalVotes);
    return (
      <div
        className="progress-bar"
        role="progressbar"
        style={{"width": percent + "%", "backgroundColor":color}}
        aria-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax="100"
        key={answer.answer}>

      </div>

    );
  });

  return (
    <li onClick={() => onPollSelect(poll)} className='list-group-item'>
      <div className='poll-list'>
        <div className='poll-list-title'>
          <h5>{poll.question}</h5>
        </div>
        <div className='poll-list-answers'>
          <div className="progress">
            {pollBars}

          </div>
        </div>
      </div>
    </li>
  );
};
/*
<div className="progress-bar bg-primary" role="progressbar" style={{"width": "15%"}} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
<div className="progress-bar bg-success" role="progressbar" style={{"width": "30%"}} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
<div className="progress-bar bg-warning" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
<div className="progress-bar bg-danger" role="progressbar" style={{"width": "35%"}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div>
*/

export default PollListItem;
