import React, { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Multiselect from "multiselect-react-dropdown";
import "./modal.css";
import { useContext } from "react";
import { Context } from "../../context/context";
import ClipLoader from "react-spinners/ClipLoader";

const Modal = ({ reFetch }) => {
  
  const [showClip, setShowClip] = useState(false);
  const [msg, setmsg] = useState("");
  const { loadProfile } = useContext(Context);
  const [slots, setslots] = useState([]);
  const onCheckboxchange = (v, id) => {
    if (document.getElementById(id).checked == true) {
      let newa = [...slots];
      newa.push({
        slot: id,
        adFrequency: 1
      })
      setslots(newa);
      console.log(slots)
    } else {
      let newa = slots.filter((itm)=>itm.slot !== id)
      setslots(newa)
      console.log(slots)
    }
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const onFrequencyChange = (v, id) => (e) => {
    if (document.getElementById(id).checked == true) {
      const newSlots = [...slots]; // Create a copy of the slots array
      const slotIndex = newSlots.findIndex((slot) => slot.slot === id); // Find the index of the slot to be updated
      if (slotIndex !== -1) {
        newSlots[slotIndex] = { ...newSlots[slotIndex], adFrequency: e.target.value }; // Update the ad frequency of the slot
        setslots(newSlots); // Update the state with the updated slots array
      }
    }
  };

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const [devices, setDevices] = useState([]);
  const handleLoadDevices = async () => {
    const res = await axiosInstance.get("/load-devices", config);
    setDevices(res.data);
  };
  const [customers, setCustomers] = useState([]);
  console.log(customers);
  const [customer, setCustomer] = useState("");
  const handleLoadCustomers = async () => {
    const res = await axiosInstance.get("/load-customers", config);
    setCustomers(res.data);
  };
  const [groups, setGroups] = useState([])
  const handleLoadGroups = async () => {
    const res = await axiosInstance.get("/load-groups", config)
    setGroups(res.data)
  }
  const handleSelectChange = () => {
    setCustomer(document.querySelector("#customer").value);
  };
  const [info, setinfo] = useState({});
  const handleChange = (e) => {
    setinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleSubmit = async (e) => {
    setmsg("");

    e.preventDefault();
    setShowClip(true);
    try {
      const newVideo = {
        ...info,
        devices: selectedGroups,
        slotsWithFrequencies: slots,
        customerEmail: customer,
      };
      const res = await axios.post(
        `${BASE_URL}/create-queue`,
        newVideo,
        config
      );

     
      document.querySelector("#my-modal-3").checked = false;
      reFetch();
    } catch (error) {
      setmsg(error.response.data.message);
    }
    setShowClip(false);
  };

  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="my-modal-3"
        onClick={() => {
          handleLoadDevices();
          handleLoadCustomers();
          handleLoadGroups();
        }}
        className="btn border-0 hover:bg-[#FFB800] min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px] w-[202px] h-[45]  bg-[#FFB800] text-[#fff] text-[21.07px] font-bold"
      >
        Add Video
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative w-[100%] max-w-max p-0">
          <div className="sticky top-0 w-full">
            <label
              htmlFor="my-modal-3"
              className="btn btn-md btn-circle absolute right-5 top-6 bg-white text-[#333] hover:bg-white hover:text-[#333]"
            >
              X
            </label>
            <div className=" text-left text-white pl-11 pt-3 pb-2 h-[87px] flex items-center top-panel">
              <h1 className="text-device-name font-bold text-[1.7rem]">
                Add Video
              </h1>
            </div>
          </div>
          <form
            className="flex flex-col gap-8  mt-[30px] min-w-[300px] min-h-[200px] w-[500px] items-center"
            action=""
          >
            <div className="input-container  w-[80%]">
              <label htmlFor="">Name of the advertisement</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
                className="w-full  input"
                defaultValue={info.name ? info.name : ""}
              />
            </div>
            <div className=" input-container   w-[80%]">
              <h1>Select the customer</h1>
              <select
                onChange={handleSelectChange}
                id="customer"
                className="w-full border px-2 bg-[white] rounded py-3 outline-none"
              >
                <option>Select customer</option>

                {customers?.map((itm) => (
                  <option value={itm.email}>{itm.name}</option>
                ))}
              </select>
            </div>
            <div className=" input-container  w-[80%]">
              <h1>URL of the advertisement</h1>
              <input
                id="videolink"
                type="text"
                placeholder="Video Link"
                className="w-full input"
                name="url"
                onChange={handleChange}
              />
            </div>
            <div className="flex-col items-center gap-3 input-container  pt-12  min-w-[80%]">
              <label htmlFor="">
                Select the Groups to publish this advertisement
              </label>
              <Multiselect
                options={groups}
                displayValue="name"
                onSelect={(selectedList, selectedItem) =>{
                  const deviceIds = selectedItem.devices.map(device => device._id);
                  setSelectedGroups([...selectedGroups, ...deviceIds]);
                  console.log(selectedGroups)
                }
                  
                }
                onRemove={(selectedList, removedItem) => {
                  const removedGroupDeviceIds = removedItem.devices.map(device => device._id);
                  setSelectedGroups(selectedGroups.filter(groupId => !removedGroupDeviceIds.includes(groupId)));
                console.log(selectedGroups)
                }}
              />
            </div>
            <div className="flex-col items-center gap-3 input-container  py-12  min-w-[80%]">
              <label htmlFor="">
                Select the devices to publish this advertisement
              </label>
              <Multiselect
                options={devices}
                displayValue="name"
                onSelect={(selectedList, selectedItem) =>{
                  if (!selectedGroups.includes(selectedItem._id)) {
                    setSelectedGroups([...selectedGroups, selectedItem._id]);
                  }
                }
                }
                onRemove={(selectedList, removedItem) => {
                  setSelectedGroups((current) =>
                    current.filter((elm) => elm != removedItem._id)
                  );
                }}
              />
            </div>
            <div className=" input-container  w-[80%]">
              <h1>Start Date</h1>
              <input
                id="startdate"
                type="date"
                name="startDate"
                onChange={handleChange}
                className="w-full input"
              />
            </div>
            <div className="input-container w-[80%]">
              <h1 htmlFor="enddate">End Date</h1>
              <input
                id="enddate"
                type="date"
                name="endDate"
                onChange={handleChange}
                className="w-full input"
              />
            </div>
            <div className="w-[80%] flex flex-col gap-8 py-12">
              <h3>Select Time slots for the advertisement</h3>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotOne"
                    onChange={() => onCheckboxchange(0, "slotOne")}
                  />
                  <label htmlFor="">9am to 10am</label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    name="slotOne"
                    onChange={onFrequencyChange(0, "slotOne")}
                    value={slots.find(item => item.slot === "slotOne")?.adFrequency || 0}
                  />
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotTwo"
                    onChange={() => onCheckboxchange(1, "slotTwo")}
                  />
                  <label htmlFor="">10am to 11am </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(1, "slotTwo")}
                    value={slots.find(item => item.slot === "slotTwo")?.adFrequency || 0}
                    />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotThree"
                    onChange={() => onCheckboxchange(2, "slotThree")}
                  />
                  <label htmlFor="">11am to 12pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(2, "slotThree")}
                    value={slots.find(item => item.slot === "slotThree")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotFour"
                    onChange={() => onCheckboxchange(3, "slotFour")}
                  />
                  <label htmlFor="">12pm to 1pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(3, "slotFour")}
                    value={slots.find(item => item.slot === "slotFour")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotFive"
                    onChange={() => onCheckboxchange(4, "slotFive")}
                  />
                  <label htmlFor="">1pm to 2pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(4, "slotFive")}
                    value={slots.find(item => item.slot === "slotFive")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotSix"
                    onChange={() => onCheckboxchange(5, "slotSix")}
                  />
                  <label htmlFor="">2pm to 3pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(5, "slotSix")}
                    value={slots.find(item => item.slot === "slotSix")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotSeven"
                    onChange={() => onCheckboxchange(6, "slotSeven")}
                  />
                  <label htmlFor="">3pm to 4pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(6, "slotSeven")}
                    value={slots.find(item => item.slot === "slotSeven")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotEight"
                    onChange={() => onCheckboxchange(7, "slotEight")}
                  />
                  <label htmlFor="">4pm to 5pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(7, "slotEight")}
                    value={slots.find(item => item.slot === "slotEight")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotNine"
                    onChange={() => onCheckboxchange(8, "slotNine")}
                  />
                  <label htmlFor="">5pm to 6pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(8, "slotNine")}
                    value={slots.find(item => item.slot === "slotNine")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotTen"
                    onChange={() => onCheckboxchange(9, "slotTen")}
                  />
                  <label htmlFor="">6pm to 7pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(9, "slotTen")}
                    value={slots.find(item => item.slot === "slotTen")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotEleven"
                    onChange={() => onCheckboxchange(10, "slotEleven")}
                  />
                  <label htmlFor="">7pm to 8pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(10, "slotEleven")}
                    value={slots.find(item => item.slot === "slotEleven")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotTwelve"
                    onChange={() => onCheckboxchange(11, "slotTwelve")}
                  />
                  <label htmlFor="">8pm to 9pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(11, "slotTwelve")}
                    value={slots.find(item => item.slot === "slotTwelve")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotThirteen"
                    onChange={() => onCheckboxchange(12, "slotThirteen")}
                  />
                  <label htmlFor="">9pm to 10pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(12, "slotThirteen")}
                    value={slots.find(item => item.slot === "slotThirteen")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
              <div className="border rounded px-2 py-2 text-sm">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    name=""
                    id="slotFourteen"
                    onChange={() => onCheckboxchange(13, "slotFourteen")}
                  />
                  <label htmlFor="">10pm to 11pm </label>{" "}
                </div>
                <div className="flex gap-4 px-7">
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="border px-2  rounded"
                    onChange={onFrequencyChange(13, "slotFourteen")}
                    value={slots.find(item => item.slot === "slotFourteen")?.adFrequency || 0}
                  />{" "}
                </div>
              </div>
            </div>
            <div className="pb-6 button-section flex items-center gap-4">
              <label
                className="btn add-video-btn"
                htmlFor="my-modal-3"
                onClick={handleSubmit}
              >
                Add Video
              </label>
              {showClip && (
                <span className="flex  gap-4 items-center">
                  <ClipLoader color="#b600ff" /> Adding video{" "}
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
    </>
  );
};

export default Modal;
