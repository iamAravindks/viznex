import React from "react";
import DoughnutChart from "../../components/Charts/DoughnutChart";

const DashboardPage = () => {
  return (
    <div className="min-h-[100vh] flex flex-col pt-24">
      <div className="charts max-w-max relative">
        <DoughnutChart />
      </div>
    </div>
  );
};

export default DashboardPage;
