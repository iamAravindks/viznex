import React, { useContext } from "react";
import { Context } from "../../context/context";
import ReactPlayer from 'react-player'

const AdsPage = () => {
  const {  userInfo } = useContext(Context);
console.log(userInfo)
  return <div className="pt-20">
    <div>
      <h1 className="text-3xl font-bold">Your advertisements</h1>

      <div>
        {userInfo.ads != undefined && (
          userInfo.ads.length == 0 ? (
          <h1>You have no ads currently</h1>
        ):(
          <div>
            {userInfo.ads.map((itm)=>(
              <div className="bg-[#6b7fdb] my-20 rounded flex justify-between w-[80%] px-12 py-8">
                <h1 className="text-2xl font-bold text-white">{itm.name}</h1>
                <ReactPlayer url={itm.url}  width="60%"/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>;
};

export default AdsPage;
