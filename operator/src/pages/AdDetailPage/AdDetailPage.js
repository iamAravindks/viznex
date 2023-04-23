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
    console.log("hello")
    const labels = ['Slot 1', 'SLot 2', 'Slot 3', 'Slot 4', 'Slot 5', 'SLot 6', 'slot 7', 'Slot 8', 'Slot 9', 'Slot 10'];
    const options = {
        responsive: true
      }; 
    const datas = {
    labels,
    datasets: [
        {
        label: 'Frequency',
        data: labels.map(() => 5),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
        label: 'No. of Times Played',
        data: labels.map(() => 7),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
    };
    

    return(
        <div>
            {data && data.ad &&
            <div>
                {
                     loading ? 
                     <div className="w-full h-[70vh] flex justify-center items-center">
                         <ClipLoader />
                     </div>
                     :
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
                                                <h1 className="font-semibold text-xl pb-2">Device 1 {itm.deviceId}</h1>
                                                <hr />
                                                <Bar options={options} data={datas} />
                                            </div>
                                         ))
                                     }
                                     
                                 </div>
                             </div>
                         </div>
                     </div>
                }
            </div>
           }
        </div>
    )
}

export default AdDetailPage


