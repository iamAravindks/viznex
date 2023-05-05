import { useState } from "react"



const GroupView = ({itm}) => {
  const [openGroupViewModal, setOpenGroupViewModal] = useState(false)
  return(
    <div>
    <button className="device-gradient px-3 py-1 font-bold text-white rounded shadow-md" onClick={()=>setOpenGroupViewModal(true)}>View</button >
    {openGroupViewModal &&
        <div className="absolute flex justify-center items-center top-0 left-0 z-[100000000] bg-[#000000a3] w-[100vw] h-[100vh]">
        <div className="w-[40%] rounded">
            <div className="device-gradient rounded-t py-8 px-8 flex justify-between">
            <h1 className="text-white font-bold text-2xl">Group {itm.name}</h1>
            <button
            className="text-3xl text-white font-bold"
                onClick={() => {
                  setOpenGroupViewModal(false);
                }} > X
            </button>
        </div>

        <div className="p-8 bg-white">
                <table className="bg-[white]">
                  <tr>
                    <th>Device Id</th>
                    <th>Name</th>
                    <th>Location</th>
                  </tr>
                  {itm.devices?.map((obj)=>(
                    <tr>
                      <td>{obj.deviceId}</td>
                      <td>{obj.name}</td>

                      <td>{obj.location}</td>

                    </tr>
                  ))}
                </table>
        </div>
      </div>
    </div>
    }</div>
  )
}

export default GroupView