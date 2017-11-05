import React from 'react';

const PollListItem = ({poll, onPollSelect}) => {

  return (
    <li onClick={() => onPollSelect(poll)} className='list-group-item'>
      <div className='poll-list'>
        <div className='poll-list-title'>
          <h5>{poll.question}</h5>
        </div>
        <div className='poll-list-answers'>
          <div className="progress">
            <div className="progress-bar bg-primary" role="progressbar" style={{"width": "15%"}} aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>
            <div className="progress-bar bg-success" role="progressbar" style={{"width": "30%"}} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
            <div className="progress-bar bg-warning" role="progressbar" style={{"width": "20%"}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
            <div className="progress-bar bg-danger" role="progressbar" style={{"width": "35%"}} aria-valuenow="35" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PollListItem;
