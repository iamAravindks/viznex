import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const GroupEdit = ({ itm , reFetch}) => {
  const [openGroupEditModal, setOpenGroupEditModal] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState(
    itm?.devices?.map(device => device._id) ?? []
  );
    const [info, setinfo] = useState({ name: itm.name });
  const [showClip, setShowClip] = useState(false);
  const [msg, setmsg] = useState("");
  const handleChange = (e) => {
    setinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const [devices, setDevices] = useState([]);
  const handleLoadDevices = async () => {
    const res = await axiosInstance.get("/load-devices", config);
    setDevices(res.data);
  };
  const handleSubmit = async (e) => {
    setmsg("");

    e.preventDefault();
    setShowClip(true);
    try {
      const newGroup = {
          ...info,        devices: selectedDevices,

      };
      console.log(newGroup);
      const res = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/update/${itm._id}`,
        newGroup,
        config
      );
      setOpenGroupEditModal(false)
      reFetch()
    } catch (error) {
      setmsg(error.response.data.message);
    }
    setShowClip(false);

  };
  return (
    <div>
      <button
        className="device-gradient px-3 py-1 font-bold text-white rounded shadow-md"
        onClick={() => {
          setOpenGroupEditModal(true);
          handleLoadDevices();
        }}
      >
        edit
      </button>
      {openGroupEditModal && (
        <div className="absolute flex justify-center items-center top-0 left-0 z-[100000000] bg-[#000000a3] w-[100vw] h-[100vh]">
          <div className="w-[40%] rounded">
            <div className="device-gradient rounded-t py-8 px-8 flex justify-between">
              <h1 className="text-white font-bold text-2xl">
                Group {itm.name}
              </h1>
              <button
                className="text-3xl text-white font-bold"
                onClick={() => {
                  setOpenGroupEditModal(false);
                }}
              >
                {" "}
                X
              </button>
            </div>

            <div className="p-8 bg-white w-full  flex justify-start">
              <form action="" className="w-full">
                <h1 className="font-bold text-left">Edit Group Name</h1>
                <br />
                <input
                  type="text"
                  name="name"
                  className=" border px-4 py-2 rounded outline-none w-full"
                  defaultValue={itm.name}
                  onChange={handleChange}
                />
                <h1 className="font-bold text-left mt-8">
                  Add or delete devices from the group
                </h1>
                <Multiselect
                  options={devices}
                  displayValue="name"
                  selectedValues={itm.devices}
                  onSelect={(selectedList, selectedItem) =>
                    setSelectedDevices([...selectedDevices, selectedItem._id])
                  }
                  onRemove={(selectedList, removedItem) => {
                    setSelectedDevices((current) =>
                      current.filter((elm) => elm !== removedItem._id)
                    );
                  }}
                />

                <div pb-6 button-section flex items-center gap-4>
                  <button
                    className="rounded px-4 py-2 text-white font-bold text-lg device-gradient mt-20"
                    onClick={handleSubmit}
                  >
                    Update Group
                  </button>
                  {showClip && (
                    <span className="flex  gap-4 items-center">
                      <ClipLoader color="#b600ff" /> Updating Group{" "}
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
      )}
    </div>
  );
};

export default GroupEdit;
