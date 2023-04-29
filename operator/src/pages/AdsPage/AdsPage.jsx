import React, { useEffect, useState } from "react";
import AdPageTable from "../../components/Table/AdPageTable";

import Modal from "../../components/Modals/Modal";
import { useContext } from "react";
import { Context } from "../../context/context";
import useFetch from "../../hooks/useFetch";
import AdPageModal from "../../components/Modals/AdPageModal";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const AdsPage = () => {
  const navigate = useNavigate();
  const {data, loading, error, reFetch} = useFetch("/load-ads")
  
  console.log(data)
  const [selectedCard, setSelectedCard] = useState(null);
  const handleClick = (id) => {
    navigate(`/ad/${id}`);
  };
  return (
    <div className="w-full px-12 pt-20 ">
      <h1 className="text-3xl font-bold">Ads you have</h1>
      <p>
        Here you can see all the ads you have published and their statistics
      </p>
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
                  <button className="px-4 py-1 border-0 hover:bg-[#FFB800]  capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px]   bg-[#FFB800] text-[#fff] text-sm font-bold">
                    Edit
                  </button>
                  <button className="px-4 py-1 border-0 hover:bg-[#FFB800] capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px]   bg-[#FFB800] text-[#fff] text-sm font-bold">
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
