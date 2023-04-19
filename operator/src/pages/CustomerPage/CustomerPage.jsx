import {useState, useEffect} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import CustomerModal from "../../components/Modals/CustomerModal";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import CustomerViewModal from "../../components/Modals/CustomerViewModal";
import CustomerEditModal from "../../components/Modals/CustomerEditModal";
const CustomerPage = () => {
  const { data , loading , reFetch} = useFetch("/load-customers");
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardedit, setSelectedCardedit] = useState(null);
  const handleClick = (card) => {
    setSelectedCard(card);
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const axiosInstance = axios.create({
    baseURL: "https://api.viznx.in/api",
  });
  const handleDelete = async (id) => {
    await axiosInstance.delete(`/operator/customer/${id}`, config)
    reFetch()
 }
  const [dat, setdat] = useState([])
  useEffect(()=>{
    setdat(data)
    console.log(data)
  }, [data])
  return (
    <div className=" pt-20 pl-16 pb-16">
        <CustomerModal reFetch={reFetch}/>
        <div className="pt-20">
      <h1 className="font-bold text-2xl">List of devices</h1>
      <div className="py-4 ">
    {loading ? (
      <div className="flex justify-center items-center my-40"><ClipLoader /></div>
    ):
    (
      <div className="flex gap-8 flex-wrap">
        {dat && dat.map((obj, i)=>(
            <div className="w-[clamp(200px,78%,250px)] bg-white shadow-[0_0_68px_rgba(0,0,0,0.25)] rounded-[10px] min-h-[251px] ">
            <div
              className=" grid place-items-center font-black rounded-[10px_0_23px] max-w-[167px] h-[46px] text-white corner-tab"
              style={{
                background: "linear-gradient(94.26deg, #FF8A00 -1.67%, #FFD600 100%)",
              }}
            >
              <p className="text">Customer {i+1}</p>
            </div>
            <div className="flex flex-col items-center mt-12 text-center location">
              <p className="text-[23px] text-[#4c4c4c] leading-6 font-[600] main-loc">
                {obj.name}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>handleClick(obj)}>View</button>
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>setSelectedCardedit(obj)}>Edit</button>
                <button className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]" onClick={()=>handleDelete(obj._id)}>Delete</button>

              {/* <DeviceViewModal obj={obj}/>
              <DeviceEditModal obj={obj} reFetch={reFetch}/> */}
{/*               <button onClick={handleClick(obj)}>View</button>
 */}{/*               <button onClick={handleDelete} className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 my-4 bg-white text-[#828282] text-[11px]">Delete</button>
 */}              </div>
            </div>
          </div>

    ))}

{ selectedCard  && <CustomerViewModal itm={selectedCard} setOpen={setSelectedCard}/>}
{selectedCardedit && <CustomerEditModal obj={selectedCardedit} reFetch={reFetch} setOpen={setSelectedCardedit}/>}

      </div>
    )}
   
   
   
    
      </div>
      </div>

    </div>

  );
};

export default CustomerPage;
