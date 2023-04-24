import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const labels = ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'Slot 6', 'Slot 7', 'Slot 8', 'Slot 9', 'Slot 10','Slot 11', 'Slot 12', 'Slot 13','Slot 14'];



export function BarChart({obj}) {
  const options = {
    scales: {
      y: {
          ticks: {
              precision: 0
          }
      }
  }
  };
  
console.log(obj)
    const data = {
        labels,
        datasets: [
          {
            label: 'Frequency',
            data:  obj.frequencies,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'No of Times Video Played',
            data: obj.noOfTimesPlayedarray,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
  return <Bar options={options} data={data} />;
}
