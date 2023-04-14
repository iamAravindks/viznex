import React from "react";
import DeviceModal from "../../components/Modals/DeviceModal";
import OperatorModel from "../../components/Modals/OperatorModel";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  // const data = {
  //   labels: ["Himalaya", "Nike", "Adidas"],
  //   datasets: [
  //     {
  //       label: "# of devices",
  //       data: [12, 3, 21],
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.2)",
  //         "rgba(54, 162, 235, 0.2)",
  //         "rgba(255, 206, 86, 0.2)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };
  return (
    <div className="min-h-[100vh] flex flex-col pt-24">
      <div className="charts max-w-max flex gap-6">
      </div>
    </div>
  );
};

export default DashboardPage;
