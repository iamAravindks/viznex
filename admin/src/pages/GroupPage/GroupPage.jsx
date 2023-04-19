import axios from "axios";
import React, { useEffect, useState } from "react";
// import DeviceCard from "../../components/DeviceCard/DeviceCard";
import OperatorCard from "../../components/DeviceCard/OperatorCard";
import OperatorModel from "../../components/Modals/OperatorModel";
import useFetch from "../../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";
import OperatorViewModal from "../../components/Modals/OperatorViewModal";
import OperatorEditModal from "../../components/Modals/OperatorEditModal";
import { useNavigate } from "react-router-dom";

const GroupPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardedit, setSelectedCardedit] = useState(null);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/operator/${id}`)
  };
 
  const { data, loading, reFetch } = useFetch("/load-admin-operators");

  const [dat, setdat] = useState([])
 useEffect(()=>{
   setdat(data)
   console.log(data)
 }, [data])

 const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});
 const handleDelete = async (id) => {
    await axiosInstance.delete(`/admin/operator/${id}`, config)
    reFetch()
 }

  return (
    <div className="w-full  pt-20 pl-16 pb-16  gap-[64px]">
      
      <OperatorModel reFetch={reFetch}/>
      <div className="pt-20">
      <h1 className="font-bold text-2xl">List of operators</h1>
      <div className="py-4">
        {loading ? (<div className="flex justify-center my-40"><ClipLoader /></div>):(
          <div className="flex flex-wrap gap-8">
            {dat && dat.map((obj, i)=>(
              <div className="w-[clamp(200px,78%,250px)] bg-white shadow-[0_0_68px_rgba(0,0,0,0.25)] rounded-[10px] min-h-[251px] ">
              <div
                className=" grid place-items-center font-black rounded-[10px_0_23px] max-w-[167px] h-[46px] text-white corner-tab"
                style={{
                  background:
                    "linear-gradient(165.71deg, #AB00FF 7.52%, #4200FF 92.05%)",
                }}
              >
                <p className="text">Operator {i+1}</p>
              </div>
              <div className="flex flex-col items-center mt-12 text-center location">
                <p className="text-[23px] text-[#4c4c4c] leading-6 font-[600] main-loc">
                  {obj.name}
                </p>
                <p className="text-[17px] text-[#4c4c4c] resides">{obj.location}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>handleClick(obj._id)}>View</button>
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>setSelectedCardedit(obj)}>Edit</button>
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>handleDelete(obj._id)}>Delete</button>

                </div>
        
              </div>
            </div>

            ))}


{ selectedCard  && <OperatorViewModal itm={selectedCard} setOpen={setSelectedCard}/>}
{selectedCardedit && <OperatorEditModal obj={selectedCardedit} reFetch={reFetch} setOpen={setSelectedCardedit}/>}



          </div>
        )}
   {/*   */}
      </div>
      </div>
     
    </div>
  );
};

export default GroupPage;
