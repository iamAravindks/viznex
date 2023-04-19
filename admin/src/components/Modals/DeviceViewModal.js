import React from "react";

const DeviceViewModal = ({itm, setOpen}) => {
  return (
    <>
 <div className=" fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-full   ">
      <div className="bg-[white] w-[80%]   shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] border-none rounded-[20px] fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
          <div className="flex justify-between rounded-t-[20px] px-12 py-4 operator-gradient text-white" >
                <div className="">
                <h1 className="text-3xl font-bold">{itm.name}</h1>
                <p>{itm.location}</p>
              </div>
                <button className="rounded-full hover:bg-[rgba(0,0,0,0.5)] w-[40px] text-white font-bold text-2xl hover:text-[white]  h-[40px]" onClick={()=>setOpen(null)}>x</button>
          </div>

          <div className="py-4 px-12">
            <h1 className="text-xl font-bold">Slot Details</h1>
            
            <div className="flex flex-col">
              
              {itm.slots && itm.slots.map((obj)=>(
                <div className="border rounded px-4 py-2">
                  <h1>{obj.name} Queue</h1>
                  

                </div>
              ))}
            </div>

          </div>
      
      
      
      </div>
    </div>    
    
    
    </>
  );
};

export default DeviceViewModal;
