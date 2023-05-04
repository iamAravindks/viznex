import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const GroupCreateModal = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  console.log(process.env.REACT_APP_BASE_URL);
  const [openGroupCreateModal, setOpenGroupCreateModal] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [showClip, setShowClip] = useState(false);
  const [msg, setmsg] = useState("");

  const [devices, setDevices] = useState([]);
  const handleLoadDevices = async () => {
    const res = await axiosInstance.get("/load-devices", config);
    setDevices(res.data);
  };
  const [info, setinfo] = useState({});
  const handleChange = (e) => {
    setinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
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
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/group/create-new`,
        newGroup,
        config
      );
    } catch (error) {
      setmsg(error.response.data.message);
    }
    setShowClip(false);
  };
  return (
    <div>
      <button
        className="device-gradient px-4 py-2 rounded-full text-lg shadow-md font-bold text-white"
        onClick={() => {
          setOpenGroupCreateModal(true);
          handleLoadDevices();
        }}
      >
        Create a new group
      </button>

      {openGroupCreateModal && (
        <div className="absolute flex justify-center items-center top-0 left-0 z-[100000000] bg-[#000000a3] w-[100vw] h-[100vh]">
          <div className="w-[40%] rounded">
            <div className="device-gradient rounded-t py-8 px-8 flex justify-between">
              <h1 className="text-white font-bold text-2xl">Create a group</h1>
              <button
                className="text-3xl text-white font-bold"
                onClick={() => {
                  setOpenGroupCreateModal(false);
                }}
              >
                x
              </button>
            </div>
            <div className="p-8 bg-white">
              <form action="">
                <label htmlFor="" className="font-bold">
                  Enter Group Name
                </label>
                <br />
                <input
                  onChange={handleChange}
                  type="text"
                  name="name"
                  className=" my-4 border rounded outline-none px-4 py-2 w-full"
                  placeholder="Group Name"
                />
                <label htmlFor="" className="font-bold">
                  Select Devices
                </label>
                <br />
                <Multiselect
                  options={devices}
                  displayValue="name"
                  onSelect={(selectedList, selectedItem) =>
                    setSelectedDevices([...selectedDevices, selectedItem._id])
                  }
                  onRemove={(selectedList, removedItem) => {
                    setSelectedDevices((current) =>
                      current.filter((elm) => elm != removedItem._id)
                    );
                  }}
                />
                <div pb-6 button-section flex items-center gap-4>
                  <button
                    className="rounded px-4 py-2 text-white font-bold text-lg device-gradient mt-20"
                    onClick={handleSubmit}
                  >
                    Create Device
                  </button>
                  {showClip && (
                    <span className="flex  gap-4 items-center">
                      <ClipLoader color="#b600ff" /> Creating Group{" "}
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

export default GroupCreateModal;
