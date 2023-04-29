import React from "react";
import DoughnutChart from "../../components/Charts/DoughnutChart";
import { FaUserFriends, FaPlay } from "react-icons/fa";

const DashboardPage = () => {
  return (
    <div className="min-h-[100vh] flex flex-col pt-24">
        <div className="flex justify-around"> 
        <div className="flex border border-[orange] px-4 py-4 gap-8 shadow-md rounded-[10px]">
            <div>
              <FaUserFriends size={40} color="orange" className="mb-4"/>
              <h1 className="text-sm">Total you have</h1>
              <h1 className="font-bold text-lg">Customers</h1>
            </div>
            <div className="flex items-end">
              <h1 className="font-bold text-7xl">21</h1>
            </div>
          </div>
          <div className="flex border px-4 py-4 gap-8 shadow-md rounded-[10px]">
            <div>
              <FaPlay size={40} className="mb-4"/>
              <h1 className="text-sm">Total no of</h1>
              <h1 className="font-bold text-lg">Ads published</h1>
            </div>
            <div className="flex items-end">
              <h1 className="font-bold text-7xl">21</h1>
            </div>
          </div>
          
          <div className="flex border px-4 py-4 gap-8 shadow-md rounded-[10px]">
            <div>
              <FaUserFriends size={40} className="mb-4"/>
              <h1 className="text-sm">Total you have</h1>
              <h1 className="font-bold text-lg">Customers</h1>
            </div>
            <div className="flex items-end">
              <h1 className="font-bold text-7xl">21</h1>
            </div>
          </div>
          <div className="flex border px-4 py-4 gap-8 shadow-md rounded-[10px]">
            <div>
              <FaUserFriends size={40} className="mb-4"/>
              <h1 className="text-sm">Total you have</h1>
              <h1 className="font-bold text-lg">Customers</h1>
            </div>
            <div className="flex items-end">
              <h1 className="font-bold text-7xl">21</h1>
            </div>
          </div>
        </div>


        
    </div>
  );
};

export default DashboardPage;
