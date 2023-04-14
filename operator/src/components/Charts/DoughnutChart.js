import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import React, { useRef } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  //   const chartref = useRef(<Doughnut />);
  //   console.log(chartref);
  const data = {
    labels: ["Himalaya", "Nike", "Adidas"],
    datasets: [
      {
        label: "# of devices",
        data: [12, 3, 21],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
        cutout: "80%",
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
  };
  return <Doughnut className="" data={data} options={options} />;
};

export default DoughnutChart;
