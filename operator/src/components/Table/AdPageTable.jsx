import AdPageModal from "../Modals/AdPageModal";
import "./adpagetable.css";

const AdPageTable = ({itm}) => {
  return (
    <div className="flex items-center bg-[#FFF7E7] p-[1.1vw_1vw] rounded-[15px] min-w-min w-[90%] justify-between">
      <div className="flex items-center justify-around gap-48">
        <p className="text-2xl font-semibold text-[#FFA800]">
          {itm.ad.name}
        </p>
        </div>
      <div className="flex gap-36">
        <AdPageModal ads={itm} />
       
      </div>
    </div>
  );
};

export default AdPageTable;
