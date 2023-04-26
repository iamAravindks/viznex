import { useLocation } from "react-router-dom"
import ReactPlayer from 'react-player'

import useFetch from "../../hooks/useFetch"

import ClipLoader from "react-spinners/ClipLoader"
import { BarChart } from "../../components/Charts/BarChart";

 


const AdDetailPage = () => {
    const location = useLocation()
    const id= location.pathname.split("/")[2]

    const {data, loading, error} = useFetch(`/load-ad/${id}`)
   
    

    return(
        <div>
            
            <div>
                {
                     loading ? 
                     <div className="w-full h-[70vh] flex justify-center items-center">
                         <ClipLoader />
                     </div>
                     :
                     data && data.ad &&
                      <div>
                         <div className="device-gradient px-12 py-8">  
                             <h1 className="font-bold text-3xl">{data.ad.ad.name}</h1>
                         </div>
                         <div className="px-12 py-8 ">
                             <div className="flex gap-[10%]">
                             <div className="border rounded px-8 py-8 w-[45%]">
                                 <h1 className="font-semibold text-xl pb-4">Customer Details</h1>
                                 <div>
                                     <h1><b>Customer Name :</b> {data.ad.ad.customer.name}</h1>
                                     <h1><b>Customer Email :</b> {data.ad.ad.customer.email}</h1>

                                 </div>
                             </div>
                             <div className="w-[45%]">
                                <ReactPlayer url={data.ad.ad.url} />


                             </div></div>
                             <div className="my-28">
                                 <h1 className="text-xl font-semibold">Deployed Devices and statistics for Today</h1>
                                 <div className="my-4">
                                     {
                                         data.groupedSlots && data.groupedSlots.map((itm) =>(
                                            <div className="border rounded px-8 py-4">
                                                <h1 className="font-semibold text-xl pb-2">Device  {itm.deviceid}</h1>
                                                <hr />
                                                <div className="w-[60%] max-h-[400px]">
                                                <BarChart obj={itm}/>

                                                </div>
                                            </div>
                                         ))
                                     }
                                     
                                 </div>
                             </div>
                         </div>
                     </div>
                }
            </div>
           
        </div>
    )
}

export default AdDetailPage


