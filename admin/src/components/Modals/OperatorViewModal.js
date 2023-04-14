import React from "react";

const GroupModal = () => {
  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="operatorviewmodal"
        className="btn border-0 hover:bg-white min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[17px] w-28 h-8 mt-14 bg-white text-[#828282] text-[11px]"
      >
        View More
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="operatorviewmodal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative min-w-[580px] w-[100%] max-w-max p-0">
          <label
            htmlFor="operatorviewmodal"
            className="btn btn-md btn-circle absolute right-5 top-6 bg-white text-[#333] hover:bg-white hover:text-[#333]"
          >
            ✕
          </label>
          <div className="pt-3 pb-2 text-left text-white pl-11 top-panel">
            <h1 className="text-device-name font-bold text-[1.7rem]">
              Operator 1
            </h1>
            <p className="location-desc text-[1em]">
              Lulu Mall, Location, India
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupModal;
