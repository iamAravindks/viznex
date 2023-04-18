import React, { useEffect, useState } from "react";
import AdPageTable from "../../components/Table/AdPageTable";

import Modal from "../../components/Modals/Modal";
import { useContext } from "react";
import { Context } from "../../context/context";
import useFetch from "../../hooks/useFetch";
import AdPageModal from "../../components/Modals/AdPageModal";

const AdsPage = () => {
  const { userInfo } = useContext(Context);
  const [selectedCard, setSelectedCard] = useState(null);
  const handleClick = (card) => {
    setSelectedCard(card);
  };
  return (
    <div className="w-full px-12 pt-20 ">
      <h1 className="text-3xl font-bold">Ads you have</h1>
      <p>Here you can see all the ads you have published and their statistics</p>
      <div className="flex justify-end button-section">
        <Modal />
      </div>
      <div className="mt-12 add-videos-section flex flex-col gap-8">
        {userInfo.adsUnderOperator !== undefined &&
          userInfo.adsUnderOperator.map((itm) => (
                    <div className="flex items-center bg-[#FFF7E7] p-[1.1vw_1vw] rounded-[15px] min-w-min w-[90%] justify-between">
              <div className="flex items-center w-full justify-between gap-48">
                <p className="text-2xl font-semibold text-[#FFA800]">
                  {itm.ad.name}
                  
                </p>
                <button onClick={()=>handleClick(itm)}
                  
                  className="btn border-0 hover:bg-[#FFB800] min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px] w-[202px] h-[45]  bg-[#FFB800] text-[#fff] text-[21.07px] font-bold"
                >
                  View More
                </button>

                </div>
             
            </div>
          ))}
                          { selectedCard  && <AdPageModal itm={selectedCard} setOpen={setSelectedCard}/>}

      </div>
    </div>
  );
};

export default AdsPage;
