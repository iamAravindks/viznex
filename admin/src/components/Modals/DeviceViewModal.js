import React from "react";

const DeviceViewModal = ({itm, setOpen}) => {
  return (
    <>
 <div className=" fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-full   ">
      <div className="bg-[white] w-[80%] px-12 py-8 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] border-none rounded-[20px] fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
      <div className="flex justify-end" >
        <button className="rounded-full hover:bg-[rgba(0,0,0,0.5)] w-[40px] text-black font-bold text-2xl hover:text-[white]  h-[40px]" onClick={()=>setOpen(null)}>x</button>
      </div>
      
      <div className="">
        <h1 className="text-3xl font-bold">{itm.name}</h1>
        <p>{itm.location}</p>
      </div>
      </div>
    </div>    
    
    
    </>
  );
};

export default DeviceViewModal;
