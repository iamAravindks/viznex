import React, {useState} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import DeviceCard from "../../components/DeviceCard/DeviceCard";
import GroupCreateModal from "../../components/Modals/GroupCreateModal";
import useFetch from "../../hooks/useFetch";
const GroupPage = () => {
  const {data,loading,error , reFetch} = useFetch('/load-groups')
  console.log(data)
  return (
    <div className="w-full  pt-20 pl-16 pb-16  gap-[64px]">
      <h1 className="font-bold text-black text-3xl my-12">Groups you have created</h1>
      <GroupCreateModal reFetch={reFetch}/>
      <div className="py-20 flex flex-wrap gap-8">
      {loading ? <div className="flex justify-center my-40 w-full"><ClipLoader /></div>:
        data?.map((itm, i)=>(
          <DeviceCard itm={itm} key={i} ind={i} reFetch={reFetch}/>
        ))
      }
      </div>
      
    </div>
  );
};

export default GroupPage;
