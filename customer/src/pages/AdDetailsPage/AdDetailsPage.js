import { useLocation } from "react-router-dom";
import {useContext, useEffect, useState} from 'react'
import { Context } from "../../context/context";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ReactPlayer from "react-player";



const AdDetailsPage = ()=> {
  const location = useLocation();
    const id = location.pathname.split("/")[2];
    console.log(id)
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const BASE_URL = "https://api.viznx.in/api/customer";
      const { userInfo } = useContext(Context);
      const { data, loading } = useFetch(`/loadads/${userInfo._id}`);
      const [addata, setaddata] = useState({})
      const [adloading, setadloading] = useState(false)
      console.log(data)
      const [ad, setAd] = useState({})
      useEffect(() => {
        if (data.ads && data.ads.length !== 0) {

          const adObj = data.ads.find(itm => itm.adWithId._id === id);
          if (adObj) { // add check to ensure adObj is defined
            setAd(adObj);
          }
        }
      }, [data]);
      console.log(ad)
      useEffect(() => {
        if (Object.keys(ad).length !== 0) {
          setadloading(true);
      
          axios
            .post(`${BASE_URL}/load-devices/${id}`, { id: ad.operator }, config)
            .then((res) => {
              setaddata(res.data);
              console.log(addata);
              setadloading(false);
            })
            .catch((error) => {
              console.log(error);
              setadloading(false);
            });
        }
      }, [ad]);
      
    

  
    return (
      <div>
        {loading ?<div className="flex justify-center my-60"><ClipLoader /></div> : 
        <div>
          {adloading ? <div className="flex justify-center my-60"><ClipLoader /></div>:
          Object.keys(addata).length !== 0 &&
            <div className="px-12 py-20">
              <h1 className="font-bold text-3xl">{addata.ad.ad.name}</h1>
             <div className="flex gap-20">
             <div className="py-8">
                <ReactPlayer url={addata.ad.ad.url} />
              </div>
              <div className="w-[40%] py-8">
                <div className="border rounded w-full ">
                  <div className="device-gradient px-8 py-8 rounded-t">
                    <h1 className="font-bold text-2xl text-white">Device Details</h1>
                  </div>
                  <div className="p-8">
                    <input type="text" className="border rounded px-4 py-2 w-full" placeholder="Serach for devices" />
                  </div>
                  <div className="p-12">
                    {addata.groupedSlots?.map((itm, i) => (
                      <div className="flex justify-between py-4 border-b">
                        <div className="flex gap-4"><h1 className="font-bold text-lg text-[blue]">{i+1}</h1>
                        <h1  className="font-bold text-lg text-[blue]">{itm.deviceDetails.name}</h1></div>
                        <button className="px-4 py-1 device-gradient rounded text-white">Report</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
             </div>
             <div >
                      <div className="border rounded px-8 py-8">
                        <h1 className="text-2xl font-bold my-4" >Operator Details</h1>
                        <hr />
                        <div className="my-8 px-4">
                          <h1 className="font-bold text-lg">Operator Name : {addata.ad.ad.operator.name}</h1>
                          <h1 className="font-bold text-lg">Operator Email : {addata.ad.ad.operator.email}</h1>

                        </div>
                      </div>
             </div>
            </div>
            
          }
        </div>}
      </div>
    )
}

export default AdDetailsPage