import React, { useEffect, useState } from "react";
import AdPageTable from "../../components/Table/AdPageTable";
import axios from "axios";
import Modal from "../../components/Modals/Modal";
import { useContext } from "react";
import { Context } from "../../context/context";
import useFetch from "../../hooks/useFetch";
import AdPageModal from "../../components/Modals/AdPageModal";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import AdEditModal from "../../components/Modals/AdEditModal";

const AdsPage = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL =  process.env.REACT_APP_BASE_URL;

 const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const navigate = useNavigate();
  const {data, loading, error, reFetch} = useFetch("/load-ads")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editDataLoading, setEditDataLoading] = useState(false)
  console.log(data)
  const [devices, setDevices] = useState([]);
  const handleLoadDevices = async () => {
    const res = await axiosInstance.get("/load-devices", config);
    setDevices(res.data);
  };
  const handleDelete = async (id) => {
    await axiosInstance.delete('/delete-ad-queue', {adId: id}, config)

  }
  const [selectedCard, setSelectedCard] = useState(null);
  const handleClick = (id) => {
    navigate(`/ad/${id}`);
  };
  const [editData, setEditData] = useState({})
  const handleOpenModal = (val) => {
    setEditDataLoading(true)
    setEditModalOpen(true)
    handleLoadDevices()
    const res = axios
    .get(
      `${BASE_URL}/loadAdData/${val}`,
      
      config
    )
    .then((res) => {
      setEditData(res.data);
      setEditDataLoading(false)
    })
    .catch((err) => console.log(err));
  }
  return (
    <div className="w-full px-12 pt-20 ">
      <h1 className="text-3xl font-bold">Ads you have</h1>
      <p>
        Here you can see all the ads you have published and their statistics
      </p>
      {editModalOpen && <AdEditModal setEditModalOpen={setEditModalOpen} devices={devices} editDataLoading={editDataLoading} editData={editData}/>}
      <div className="flex justify-end button-section">
        <Modal reFetch={reFetch}/>
      </div>
      <div className="mt-12 add-videos-section flex flex-col gap-8">
        {loading ? <div className="flex justify-center my-20"><ClipLoader /></div> :
          data?.map((itm) => (
            <div className="flex flex-col items-center bg-[#FFF7E7] p-[1.1vw_1vw] rounded-[15px] min-w-min w-[40%] justify-between">
              <div className=" w-full  gap-48">
                <p className="text-2xl font-semibold text-[#FFA800]">
                  {itm.ad.name}
                </p>
                <div className="flex gap-4 my-4">
                  <button
                    onClick={() => handleClick(itm._id)}
                    className="px-4 py-1 border-0 hover:bg-[#FFB800] capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px]   bg-[#FFB800] text-[#fff] text-sm font-bold"
                  >
                    View More
                  </button>
                  <button onClick={()=> handleOpenModal(itm._id)} className="px-4 py-1 border-0 hover:bg-[#FFB800]  capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px]   bg-[#FFB800] text-[#fff] text-sm font-bold">
                    Edit
                  </button>
                  <button className="px-4 py-1 border-0 hover:bg-[#FFB800] capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px]   bg-[#FFB800] text-[#fff] text-sm font-bold" onClick={()=>handleDelete(itm.ad._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        {/*                           { selectedCard  && <AdPageModal itm={selectedCard} setOpen={setSelectedCard}/>}
         */}
      </div>
    </div>
  );
};

export default AdsPage;
