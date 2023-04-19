import React, { useContext } from "react";
import DeviceCard from "../../components/DeviceCard/DeviceCard";
import { Context } from "../../context/context";

const DevicePage = () => {
  const {  userInfo } = useContext(Context);

  return (
    <div className="pt-20">
    <div>
      <h1 className="text-3xl font-bold">Devices where your ad is published</h1>

      <div>
        {userInfo.devices != undefined && (
          userInfo.devices.length == 0 ? (
          <h1>Your ad is not published</h1>
        ):(
          <div>
            {userInfo.devices.map((itm)=>(
              <div className="bg-[#6b7fdb] my-20 rounded  w-[80%] px-12 py-8">
                <h1 className="text-2xl font-bold text-white">{itm.name}</h1>
                <h1 className="text-xl  text-white">{itm.location}</h1>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default DevicePage;
