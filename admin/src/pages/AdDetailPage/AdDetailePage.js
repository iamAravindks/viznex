import { useLocation } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";
import { AiFillCaretDown } from "react-icons/ai";
import useFetch from "../../hooks/useFetch";
const AdDetailPage = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const {data, loading, error} = useFetch(`/device/${id}`)
    console.log(
        data
    )
    return(
        <div>
            {loading ? 
            (<div className="flex justify-center items-center h-[70vh]">
            <ClipLoader color="#7605bc"/>
        </div>):
        (
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
                <div className="text-base flex flex-col items-end">
                    <h1>Password : 12345678</h1>
                    <button className="bg-[#ffc300] text-white px-2 py-1 rounded text-sm">Reset Password</button>
                    <p className="text-[red] text-sm">Please note that resetting password will logout the device</p>
                </div>
            </div>
            <div className="px-12 py-4">

                <h1 className="text-xl font-bold pb-8">Slot Details</h1>

                {data.slots != undefined && 
                data.slots.map((itm)=>(
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

export default AdDetailPage