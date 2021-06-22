import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

interface IGraphProps {
  labels: Array<string | number>;
  data: number[];
}
const Graph = (props: IGraphProps) => {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: '# of Bikes Available',
        data: props.data,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const options = {
    scales: {
      // x: {
      //   type: 'time',
      //   time: {
      //     unit: 'month',
      //     displayFormats: {
      //       month: 'MMM YYYY'
      //     }
      //   }
      // },
      // yAxes: [
      //   {
      //     ticks: {
      //       beginAtZero: true,
      //     },
      //   },
      // ],
    },
  };

  return (
    <Line
      type="line"
      data={data}
      options={options}
    />
  );

};

export default Graph;