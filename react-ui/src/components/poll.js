import React from 'react';
//import Line from 'react-chartjs';

const Poll = () => {
  const chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
        }]
    };

  const chartOptions = {};

  return (
    <div>

    </div>
  );
};
//<Line data={chartData} options={chartOptions} width="600" height="250"/>
export default Poll;
