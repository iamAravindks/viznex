import axios from "axios";
import React, { useContext, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Context } from "../../context/context";

const DeviceModal = ({reFetch}) => {
  const [info, setinfo] = useState({});
  const handleChange = (e) => {
  setinfo((prev) => ({...prev, [e.target.name] : e.target.value}))
  console.log(info)
}
const [showClip, setShowClip] = useState(false)
const [msg, setmsg] = useState('')
const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};
  const axiosInstance = axios.create({
    baseURL: "https://api.viznx.in/api",
})
const handleSubmit = async e => {
/*   setLoading(true)

 */     
 setmsg('')

  e.preventDefault();

  if(info.name && info.deviceId && info.password && info.location && info.name !== " " && info.deviceId !== " " && info.password !== " " && info.location !== " "){
    setShowClip(true)
  
  try {


    console.log(info)
    const newOperator = {
      ...info
    }
    const res = await axiosInstance.post("/admin/create-device",newOperator, config)
    document.querySelector("#devicemodel").checked = false;
    reFetch();
  } catch (error) {
    setmsg(error.response.data.message)
  }
  setShowClip(false)
  }
  else{
    setmsg("Please enter all neccessary fields")
  }
/*   setLoading(false)
 */}
  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="devicemodel"
        className="btn border-0 hover:bg-[#BC3FFF] min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px] w-[202px] h-[45]  bg-[#BC3FFF] text-[#fff] text-[21.07px] font-bold"
      >
        Add Devices
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="devicemodel" className="modal-toggle" />
      <div className="modal">
        <div className="relative modal-box">
          <label
            htmlFor="devicemodel"
            className="absolute btn btn-sm btn-circle right-2 top-2"
          >
            ✕
          </label>
          <div className="pt-5 modal-container">
            <form className="flex flex-col gap-7">
              <input
                className="input w-full max-w-xs"
                type="text"
                placeholder="deviceId"
                name="deviceId"
                
                onChange={handleChange}

              />
              <input
                className="input w-full max-w-xs"
                type="text"
                placeholder="name"
                name="name"
                
                onChange={handleChange}

              />
              <input
                className="input w-full max-w-xs"
                type="text"
                placeholder="password"
                name="password"
                
                onChange={handleChange}

              />
              <input
                className="input w-full max-w-xs"
                type="text"
                placeholder="Place"
                name="location"
                
                onChange={handleChange}
              />
              <div className="btn-section flex items-center gap-4">
                <label htmlFor="devicemodel"
                    onClick={handleSubmit} 
                  className="btn min-w-[100px] p-[10px_60px] bg-linkColor  border-0 hover:bg-[#BC3FFF]"
                >
                  Add
                </label>
                {showClip && <span  className="flex  gap-4 items-center"><ClipLoader color="#b600ff"/> Creating device </span>}{msg && <em><p className="text-[red]">{msg}</p></em>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceModal;
