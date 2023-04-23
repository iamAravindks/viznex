import { useLocation } from "react-router-dom"
import useFetch from "../../hooks/useFetch"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';

import ClipLoader from "react-spinners/ClipLoader"
import { BarChart } from "../../components/Charts/BarChart";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
 


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
                         <div className="px-12 py-8">
                             <div className="border rounded px-8 py-8">
                                 <h1 className="font-semibold text-xl pb-4">Customer Details</h1>
                                 <div>
                                     <h1><b>Customer Name :</b> {data.ad.ad.customer.name}</h1>
                                     <h1><b>Customer Email :</b> {data.ad.ad.customer.email}</h1>

                                 </div>
                             </div>
                             <div className="my-8">
                                 <h1 className="text-xl font-semibold">Deployed Devices and statistics for Today</h1>
                                 <div className="my-4">
                                     {
                                         data.groupedSlots && data.groupedSlots.map((itm) =>(
                                            <div className="border rounded px-8 py-4">
                                                <h1 className="font-semibold text-xl pb-2">Device 1 {itm.deviceid}</h1>
                                                <hr />
                                                <BarChart obj={itm}/>
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


