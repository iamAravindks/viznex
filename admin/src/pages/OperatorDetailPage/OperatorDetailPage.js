import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";
import useFetch from "../../hooks/useFetch";

const OperatorDetailPage = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    console.log(id)
    const {data, loading, error} = useFetch(`/operator/${id}`)
    console.log(typeof(data))
    console.log(data.adsUnderOperator)
    
    return(
        <div className="  ">
        {loading ?
        (<div className="flex justify-center items-center h-[70vh]">
            <ClipLoader color="#7605bc"/>
        </div>)
        
        :(data !== null && <div className="">
              <div className="flex justify-between px-12 py-8  text-white operator-gradient" >
              <div className="">
                <h1 className="text-2xl font-bold">{ data.name}</h1>
                <p>{data.location}</p>
              </div>
              </div>
  
              <div className="px-12 py-8">
                <h1 className="text-lg font-bold pb-8">Ads under Operator</h1>

                 <div>
                    {data.adsUnderOperator != undefined && 
                    (data.adsUnderOperator.length === 0 ? 
                    (<h1>This operator haven't added any ads till now</h1>) :
                    (
                        data.adsUnderOperator.map((itm)=> (
                            <div className="bg-[#e3d0ff] rounded px-4 py-2">
                                <div className="flex justify-between py-4">
                                    <h1 className="font-bold">{itm.ad.name}</h1>
                                    <p>URL:{itm.ad.url}</p>
                                </div>
                                {/* <div>
                                    <h1 className="font-semibold">Deployed Devices</h1>
                                    <div className="py-2 flex gap-4 flex-wrap">

                                    {itm.deployedDevices != undefined && itm.deployedDevices.map((device)=>(
                                        <span className="bg-[#9f00ff] px-4 py-1 text-white font-bold rounded">{device}</span>
                                       

                                    ))}
                                                                        </div>

                                </div> */}
                            </div>
                        ))
                        


                    ))
                }
                </div> 
              </div>
              
        
        </div>)}
      </div>
    )
}

export default OperatorDetailPage