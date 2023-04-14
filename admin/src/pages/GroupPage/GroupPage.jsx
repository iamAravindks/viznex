import axios from "axios";
import React, { useEffect, useState } from "react";
// import DeviceCard from "../../components/DeviceCard/DeviceCard";
import OperatorCard from "../../components/DeviceCard/OperatorCard";
import OperatorModel from "../../components/Modals/OperatorModel";
import useFetch from "../../hooks/useFetch";

const GroupPage = () => {

 
  const { data } = useFetch("/load-admin-operators");

  const [dat, setdat] = useState([])
 useEffect(()=>{
   setdat(data)
   console.log(data)
 }, [data])



  return (
    <div className="w-full  pt-20 pl-16 pb-16  gap-[64px]">
      
      <OperatorModel />
      <div className="pt-20">
      <h1 className="font-bold text-2xl">List of operators</h1>
      <div className="py-4 flex gap-8">
    {dat && dat.map((obj, i)=>(
      <OperatorCard obj={obj} h={i} />

    ))}
      </div>
      </div>
     
    </div>
  );
};

export default GroupPage;
