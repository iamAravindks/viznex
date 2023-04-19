import React from "react";
import DeviceEditModal from "../Modals/DeviceEditModal";
import DeviceViewModal from "../Modals/DeviceViewModal";
// import { Link } from "react-router-dom";
import axios from "axios";
const DeviceCard = ({obj,h, reFetch}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });
  const handleDelete = () => {

  }


  return (
    <div className="w-[clamp(200px,78%,250px)] bg-white shadow-[0_0_68px_rgba(0,0,0,0.25)] rounded-[10px] min-h-[251px] ">
      <div
        className=" grid place-items-center font-black rounded-[10px_0_23px] max-w-[167px] h-[46px] text-white corner-tab"
        style={{
          background: "linear-gradient(94.26deg, #FF8A00 -1.67%, #FFD600 100%)",
        }}
      >
        <p className="text">Device {h+1}</p>
      </div>
      <div className="flex flex-col items-center mt-12 text-center location">
        <p className="text-[23px] text-[#4c4c4c] leading-6 font-[600] main-loc">
          {obj.name}
        </p>
        <p className="text-[17px] text-[#4c4c4c] resides">{obj.location}</p>
        {/* <div className="flex flex-wrap gap-2 justify-center">
        <DeviceViewModal obj={obj}/>
        <DeviceEditModal obj={obj} reFetch={reFetch}/>
        <button onClick={handleDelete} className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]">Delete</button>
        </div> */}
      </div>
    </div>
  );
};

export default DeviceCard;
