import AdPageModal from "../Modals/AdPageModal";
import "./adpagetable.css";

const AdPageTable = () => {
  return (
    <div className="flex items-center bg-[#FFF7E7] p-[1.1vw_1vw] rounded-[15px] min-w-min w-[90%] justify-between">
      <div className="flex items-center justify-around gap-48">
        <p className="text-2xl font-semibold text-[#FFA800]">
          Himalaya Face Wash
        </p>
        <p className="text-2xl font-semibold">Himalaya Wellness Care</p>
        <p className="text-2xl font-semibold">22/02/22</p>
      </div>
      <div className="flex gap-36">
        <AdPageModal />
        <button className="btn border-0 hover:bg-[#FFB800] min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px] w-[202px] h-[45]  bg-[#FFB800] text-[#fff] text-[21.07px] font-bold">
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdPageTable;
