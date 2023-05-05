import React from "react";
import GroupEdit from "../Modals/GroupEdit";
import GroupView from "../Modals/GroupView";
import axios from "axios";
const DeviceCard = ({itm, ind, reFetch}) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const handleDelete = async(val) => {
    await axiosInstance.delete(`/delete-group/${itm._id}`, config)
    reFetch()
  }
  return (
    <div className="w-[clamp(200px,78%,250px)] bg-white shadow-[0_0_68px_rgba(0,0,0,0.25)] rounded-[10px]  ">
      <div
        className=" grid place-items-center font-black rounded-[10px_0_23px] max-w-[167px] h-[46px] text-white corner-tab"
        style={{
          background: "linear-gradient(94.26deg, #FF8A00 -1.67%, #FFD600 100%)",
        }}
      >
        <p className="text">Group {ind +1}</p>
      </div>
      <div className="flex flex-col items-center mt-12 text-center location">
        <p className="text-[23px] text-[#4c4c4c] leading-6 font-[600] main-loc">
          {itm.name}
        </p>
        <div className="flex justify-center gap-3 my-8 flex-wrap ">
        <GroupView itm={itm}/>
        <GroupEdit itm={itm} reFetch={reFetch}/>
        <button className="device-gradient px-3 py-1 font-bold text-white rounded shadow-md" onClick={()=>handleDelete(itm._id)}>Delete</button>

        </div>
       

      </div>
    </div>
  );
};

export default DeviceCard;
