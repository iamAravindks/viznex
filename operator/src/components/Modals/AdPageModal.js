import React from "react";

const AdPageModal = ({ads}) => {



  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="adpagedetails"
        className="btn border-0 hover:bg-[#FFB800] min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px] w-[202px] h-[45]  bg-[#FFB800] text-[#fff] text-[21.07px] font-bold"
      >
        View More
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="adpagedetails" className="modal-toggle" />
      <div className="modal">
        <div className="relative modal-box">
          <label
            htmlFor="adpagedetails"
            className="absolute btn btn-sm btn-circle right-2 top-2"
          >
            ✕
          </label>
          <div className="pt-5 modal-container">
            <div className="video-container ">
            <iframe width="420" height="315"
src={ads.ad.url}>
</iframe>            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default AdPageModal;
