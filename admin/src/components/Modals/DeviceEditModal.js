import { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
const DeviceEditModal = ({obj, reFetch, setOpen}) => {
  console.log(obj)
  const [info, setinfo] = useState({});
  const handleChange = (e) => {
    setinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const [showClip, setShowClip] = useState(false);
  const [msg, setmsg] = useState("");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  const handleSubmit = async (e) => {
    setmsg("");
    e.preventDefault();
   
      setShowClip(true);

      try {
        const newOperator = {
          ...info,
        };
        const res = await axiosInstance.patch(
          `/admin/device/${obj._id}`,
          newOperator,
          config
        );
        reFetch()
        setOpen(null)
      } catch (error) {
        console.log(error)
      }
      setShowClip(false);
   
  };
  return (
    <>
      {/* The button to open modal */}
      <div className=" fixed bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-full   ">
      <div className="bg-[white] w-[80%] px-12 py-8 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] border-none rounded-[20px] fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
      <div className="flex justify-end" >
        <button className="rounded-full hover:bg-[rgba(0,0,0,0.5)] w-[40px] text-black font-bold text-2xl hover:text-[white]  h-[40px]" onClick={()=>setOpen(null)}>x</button>
      </div>
     <h1 className="text-3xl font-bold">Edit Device</h1>
      <div className="py-8">
      <form className="flex flex-col my-8">
                <label htmlFor="">Device Id</label>
                <input
                  className="border w-full rounded px-2 py-1 text-[grey] max-w-xs my-2"
                  type="text"
                  defaultValue={obj.deviceId}
                  name="deviceId"
                  onChange={handleChange}
                />
                                <label htmlFor="">Name</label>

                <input
                  className=" w-full border rounded px-2 py-1 text-[grey]  max-w-xs my-2"
                  type="text"
                  defaultValue={obj.name}

                  name="name"
                  onChange={handleChange}
                />
                               <label htmlFor="">Location</label>

                <input
                  className=" w-full border rounded px-2 py-1 text-[grey] max-w-xs my-2"
                  type="text"
                  defaultValue={obj.location}

                  name="location"
                  onChange={handleChange}
                />
                <div className="btn-section flex gap-4 items-center">
                  <label
                    htmlFor="deviceeditmodal"
                    onClick={handleSubmit}
                    className="btn min-w-[100px] p-[10px_60px] bg-linkColor  border-0 hover:bg-[#BC3FFF]"
                  >
                    Update
                  </label>
                  {showClip && (
                    <span className="flex  gap-4 items-center">
                      <ClipLoader color="#b600ff" /> <em>Updating device</em>{" "}
                    </span>
                  )}
                  {msg && (
                    <em>
                      <p className="text-[red]">{msg}</p>
                    </em>
                  )}
                </div>
              </form>
      </div>
      </div>
    </div>

      {/* Put this part before </body> tag */}
   
    </>
  );
};

export default DeviceEditModal;
