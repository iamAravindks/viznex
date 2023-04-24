import { useLocation } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";
import {useState} from 'react'
import { AiFillCaretDown } from "react-icons/ai";
import useFetch from "../../hooks/useFetch";
import axios from 'axios'
const DeviceDetailPage = () => {
    const today = new Date()
    const [date, setDate] = useState(`${today.getFullYear()}-${today.getMonth() +1}-${today.getDay()}`)
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const {data, loading, error} = useFetch(`/device/${id}`)
    
    console.log(
        data
    )
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

    const axiosInstance = axios.create({
        baseURL: "https://api.viznx.in/api/operator",
    })
    const handleDate =(val)=> {
        if(val == ""){
            alert('please enter a date')
        }
        else{
            setDate(val)
            const res = axiosInstance.post(`/device/${id}`, {date: date},config )
            console.log(res)
        }
    }
    return(
        <div>
            {loading ? 
            (<div className="flex justify-center items-center h-[70vh]">
            <ClipLoader color="#7605bc"/>
        </div>):
        (data && data != undefined &&
            <div>

            <div className="device-gradient px-8 py-4">
                <h1 className="text-2xl font-bold text-white ">{data.name}</h1>
            </div>

            <div className="px-12 py-12 flex  justify-between">
                <div className="text-lg">
                    <h1>Device Name : {data.name}</h1>
                    <h1>Device ID : {data.deviceId}</h1>

                    <h1>Location : {data.location}</h1>

                </div>
                
            </div>
            <div className="px-12 py-4">

               <div className="flex items-start flex-col gap-4 pb-12">
               <h1 className="text-xl font-bold ">Slot Details for the day {date}</h1>
               <div className="flex flex-col gap-4 items-start">
                   <h1 className="text-lg">Pick a date to show the slot details for that day</h1>
                    <div className="flex gap-4">
                    <input type="date" id="date" className="border px-4 py-2 outline-none rounded" onkeydown="return false" onpaste="return false"/>
                    <button className="border rounded px-4 py-2 device-gradient font-bold text-white" onClick={()=>handleDate(document.querySelector('#date').value)}>Get slots details</button>
                    </div>               

               </div>
               </div>

                {
                data.slots?.map((itm)=>(
                    <div className="px-8 py-4 bg-[#fff1c4]">
                    <h1 className="font-bold text-lg pb-4">{itm.name}</h1>
                    {itm.queue != undefined &&
                    itm.queue.map((obj,i)=>(
                        obj.adFrequency !== 0 ?
                        <div className="bg-[#ffe78a] py-4 px-8 mb-4">
                        <h1 className="font-semibold">Advertisement {i+1}</h1>
                        <div className="py-2 font-semibold">
                            <h1>{obj.ad.name}</h1>
                            <h1>Url: {obj.ad.url}</h1>
                        </div>
                        <div className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title text-base flex items-center gap-3 font-medium">
                            Operator Details <AiFillCaretDown />
                            </div>
                            <div className="collapse-content">
                                <p>Operator Name: {obj.operator.name}</p>
                            </div>
                        </div>
                        <div className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title text-base flex items-center gap-3 font-medium">
                                Customer Details  <AiFillCaretDown />
                            </div>
                            <div className="collapse-content">
                                <p>Customer Name: {obj.ad.customer.name}</p>
                            </div>
                        </div>
                    </div>: <h1>No ads in this session</h1>
                        
                    ))}
                </div>
                ))
                }
            </div>



        </div>
        )
        
    
    
    }
        </div>
    )
}

export default DeviceDetailPage