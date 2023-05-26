import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import useFetch from "../../hooks/useFetch";
import on from '../../components/assets/on.png'
import off from '../../components/assets/off.png'

import {useNavigate} from 'react-router-dom'
const DevicePage = () => {
  const {data,loading,error} = useFetch('/load-devices')
  const navigate = useNavigate()
  const handleClick = (id) => {
    navigate(`/device/${id}`)
  };
  return(
    <div className="px-12 py-20">
      <h1 className="font-bold text-3xl">List of Devices</h1>
      <div className="py-20 ">
    {loading ? (
      <div className="flex justify-center items-center my-40"><ClipLoader /></div>
    ):
    (
      <div className="flex gap-8 flex-wrap">
        { data?.map((obj, i)=>(
            <div className="w-[clamp(200px,78%,250px)] bg-white shadow-[0_0_68px_rgba(0,0,0,0.25)] rounded-[10px] min-h-[251px] ">
           <div className="flex justify-between">
           <div
              className=" grid w-[70%] place-items-center font-black rounded-[10px_0_23px] max-w-[167px] h-[46px] text-white corner-tab"
              style={{
                background: "linear-gradient(94.26deg, #FF8A00 -1.67%, #FFD600 100%)",
              }}
            >
              <p className="text">Device {i+1}</p>
            </div>
            {
              obj.status?<div className="px-2 py-2"><img src={on} className="w-[30px] h-[30px]" /> </div>: <div className="p-2"><img src={off} className="w-[30px] h-[30px]"/></div>
            }
           </div>
            <div className="flex flex-col items-center mt-12 text-center location">
              <p className="text-[23px] text-[#4c4c4c] leading-6 font-[600] main-loc">
                {obj.name}
              </p>
              <p className="text-[17px] text-[#4c4c4c] resides">{obj.location}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>handleClick(obj._id)}>View</button>

                  </div>
            </div>
          </div>

    ))}


      </div>
    )}
   
   
   
   
      </div>
    </div>
  )
};

export default DevicePage;
