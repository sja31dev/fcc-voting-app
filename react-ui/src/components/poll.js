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



const Poll = ({poll}) => {
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

  const chartOptions = {};

  return (
    <div>
      <h3>{poll.question}</h3>
      <Doughnut data={chartData} options={chartOptions} />
      voting options
    </div>
  );
};
//<Line data={chartData} options={chartOptions} width="600" height="250"/>
export default Poll;
