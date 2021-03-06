// No state so this can be a functional Component
import React from 'react';
import PollListItem from './poll_list_item';

const PollList = (props) => {
  if (props.polls) {
    const pollItems = props.polls.map((poll) => {

      return (
        <PollListItem
          onPollSelect={props.onPollSelect}
          onPollDelete={props.onPollDelete}
          key={poll.id}
          poll={poll} />
      );
    });
    return (
      <ul className="list-group">
        {pollItems}
      </ul>
    );
  } else {
    return (
      <div>Loading...</div>
    );
  }
}

export default PollList;
