import React, {useState} from "react";
import DeviceCard from "../../components/DeviceCard/DeviceCard";
import GroupCreateModal from "../../components/Modals/GroupCreateModal";

const GroupPage = () => {
  return (
    <div className="w-full  pt-20 pl-16 pb-16  gap-[64px]">
      <h1 className="font-bold text-black text-3xl my-12">Groups you have created</h1>
      <GroupCreateModal />
      <div className="py-20">
      <DeviceCard />
      </div>
      
    </div>
  );
};

export default GroupPage;
