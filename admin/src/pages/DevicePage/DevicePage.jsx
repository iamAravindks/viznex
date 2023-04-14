import React, { useEffect, useState } from "react";
import DeviceCard from "../../components/DeviceCard/DeviceCard";
import DeviceModal from "../../components/Modals/DeviceModal";
import useFetch from "../../hooks/useFetch";

const DevicePage = () => {
  const { data } = useFetch("/load-admin-devices");

  const [dat, setdat] = useState([])
 useEffect(()=>{
   setdat(data)
   console.log(data)
 }, [data])
  return (
  <div className="w-full  pt-20 pl-16 pb-16  gap-[64px]">
  <DeviceModal />
  <div className="pt-20">
      <h1 className="font-bold text-2xl">List of operators</h1>
      <div className="py-4 flex gap-8">
    {dat && dat.map((obj, i)=>(
      <DeviceCard obj={obj} h={i} />

    ))}
      </div>
      </div>



  </div>
  )};

export default DevicePage;
