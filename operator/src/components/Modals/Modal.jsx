import React, { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Multiselect from "multiselect-react-dropdown";
import "./modal.css";
import { useContext } from "react";
import { Context } from "../../context/context";
import ClipLoader from "react-spinners/ClipLoader";

const Modal = () => {
  const [showClip, setShowClip] = useState(false);
  const [msg, setmsg] = useState("");
  const { loadProfile } = useContext(Context);
  const [slots, setslots] = useState([
    {
      slot: "slotOne",
      adFrequency: 0,
    },
    {
      slot: "slotTwo",
      adFrequency: 0,
    },
    {
      slot: "slotThree",
      adFrequency: 0,
    },
    {
      slot: "slotFour",
      adFrequency: 0,
    },
    {
      slot: "slotFive",
      adFrequency: 0,
    },
    {
      slot: "slotSix",
      adFrequency: 0,
    },
    {
      slot: "slotSeven",
      adFrequency: 0,
    },
    {
      slot: "slotEight",
      adFrequency: 0,
    },
    {
      slot: "slotNine",
      adFrequency: 0,
    },
    {
      slot: "slotTen",
      adFrequency: 0,
    },
    {
      slot: "slotEleven",
      adFrequency: 0,
    },
    {
      slot: "slotTwelve",
      adFrequency: 0,
    },
    {
      slot: "slotThirteen",
      adFrequency: 0,
    },
    {
      slot: "slotFourteen",
      adFrequency: 0,
    }
  ]);
  const onCheckboxchange = (v, id) => {
    if (document.getElementById(id).checked == true) {
      let newa = [...slots];
      newa[v].adFrequency = 1;
      setslots(newa);
    } else {
      let newa = [...slots];
      newa[v].adFrequency = 0;
      setslots(newa);
    }
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/operator";
  const onFrequencyChange = (v, id) => (e) => {
    if (document.getElementById(id).checked == true) {
      let newa = [...slots];
      newa[v].adFrequency = e.target.value;
      setslots(newa);
      console.log(slots);
    }
  };

  /*  useEffect(() => {
    loadDevices();
  }, []);
 */
  const axiosInstance = axios.create({
    baseURL: "https://api.viznx.in/api/operator",
  });
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
  const [selectedDevices, setSelectedDevices] = useState([]);

  const handleSubmit = async (e) => {
    setmsg("");

    e.preventDefault();
    setShowClip(true);
    try {
      const newVideo = {
        ...info,
        devices: selectedDevices,
        slotsWithFrequencies: slots,
      };
      const res = await axios.post(
        `${BASE_URL}/create-queue`,
        newVideo,
        config
      );
      loadProfile();
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
        onClick={handleLoadDevices}
        className="btn border-0 hover:bg-[#FFB800] min-h-0 capitalize shadow-[0_0_3.63448px_rgba(0,0,0,0.25)] rounded-[50px] w-[202px] h-[45]  bg-[#FFB800] text-[#fff] text-[21.07px] font-bold"
      >
        Add Video
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative w-[100%] max-w-max p-0">
          <label
            htmlFor="my-modal-3"
            className="btn btn-md btn-circle absolute right-5 top-6 bg-white text-[#333] hover:bg-white hover:text-[#333]"
          >
            ✕
          </label>
          <div className=" text-left text-white pl-11 pt-3 pb-2 h-[87px] flex items-center top-panel">
            <h1 className="text-device-name font-bold text-[1.7rem]">
              Add Video
            </h1>
          </div>
          <form
            className="flex flex-col gap-2  mt-[30px] min-w-[300px] min-h-[200px] w-[500px] items-center"
            action=""
          >
            <div className="flex items-center gap-3 input-container  min-w-[80%]">
              <input
                id="name"
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
                className="w-full max-w-xs input"
              />
            </div>
            <div className="flex items-center gap-3 input-container   min-w-[80%]">
              <input
                id="customer"
                type="text"
                name="customerEmail"
                placeholder="Customer"
                className="w-full max-w-xs input"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center  gap-3 input-container   min-w-[80%]">
              <input
                id="videolink"
                type="text"
                placeholder="Video Link"
                className="w-full max-w-xs input"
                name="url"
                onChange={handleChange}
              />
            </div>

            <div className="flex-col items-center gap-3 input-container   min-w-[80%]">
              <label htmlFor="">Add devices</label>
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
            </div>
            <div className="flex items-center gap-3 input-container   min-w-[80%]">
              <label htmlFor="enddate">Start Date</label>
              <input
                id="startdate"
                type="date"
                name="startDate"
                onChange={handleChange}
                className="w-full max-w-xs input"
              />
            </div>
            <div className="flex items-center gap-3 input-container min-w-[80%]">
              <label htmlFor="enddate">End Date</label>
              <input
                id="enddate"
                type="date"
                name="endDate"
                onChange={handleChange}
                className="w-full max-w-xs input"
              />
            </div>
            <div className="min-w-[80%] flex flex-col gap-8">
              <h3>Select slots</h3>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotOne"
                    onChange={() => onCheckboxchange(0, "slotOne")}
                  />
                  <label htmlFor="">Slot 1 9am to 10am</label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    name="slotOne"
                    onChange={onFrequencyChange(0, "slotOne")}
                    value={slots[0].adFrequency}
                  />
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotTwo"
                    onChange={() => onCheckboxchange(1, "slotTwo")}
                  />
                  <label htmlFor="">Slot 2 10am to 11am </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(1, "slotTwo")}
                    value={slots[1].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotThree"
                    onChange={() => onCheckboxchange(2, "slotThree")}
                  />
                  <label htmlFor="">Slot 3 11am to 12pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(2, "slotThree")}
                    value={slots[2].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotFour"
                    onChange={() => onCheckboxchange(3, "slotFour")}
                  />
                  <label htmlFor="">Slot 4 12pm to 1pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(3, "slotFour")}
                    value={slots[3].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotFive"
                    onChange={() => onCheckboxchange(4, "slotFive")}
                  />
                  <label htmlFor="">Slot 5 1pm to 2pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(4, "slotFive")}
                    value={slots[4].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotSix"
                    onChange={() => onCheckboxchange(5, "slotSix")}
                  />
                  <label htmlFor="">Slot 6 2pm to 3pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(5, "slotSix")}
                    value={slots[5].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotSeven"
                    onChange={() => onCheckboxchange(6, "slotSeven")}
                  />
                  <label htmlFor="">Slot 7 3pm to 4pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(6, "slotSeven")}
                    value={slots[6].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotEight"
                    onChange={() => onCheckboxchange(7, "slotEight")}
                  />
                  <label htmlFor="">Slot 8 4pm to 5pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(7, "slotEight")}
                    value={slots[7].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotNine"
                    onChange={() => onCheckboxchange(8, "slotNine")}
                  />
                  <label htmlFor="">Slot 9 5pm to 6pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(8, "slotNine")}
                    value={slots[8].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotTen"
                    onChange={() => onCheckboxchange(9, "slotTen")}
                  />
                  <label htmlFor="">Slot 10 6pm to 7pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(9, "slotTen")}
                    value={slots[9].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotSix"
                    onChange={() => onCheckboxchange(10, "slotEleven")}
                  />
                  <label htmlFor="">Slot 11 7pm to 8pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(10, "slotEleven")}
                    value={slots[10].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotSix"
                    onChange={() => onCheckboxchange(11, "slotTwelve")}
                  />
                  <label htmlFor="">Slot 12 8pm to 9pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(11, "slotTwelve")}
                    value={slots[11].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotSix"
                    onChange={() => onCheckboxchange(12, "slotThirteen")}
                  />
                  <label htmlFor="">Slot 13 9pm to 10pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(12, "slotThirteen")}
                    value={slots[12].adFrequency}
                  />{" "}
                </div>
              </div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    name=""
                    id="slotSix"
                    onChange={() => onCheckboxchange(13, "slotFourteen")}
                  />
                  <label htmlFor="">Slot 14 10pm to 11pm </label>{" "}
                </div>
                <div>
                  <label htmlFor="">Ad frequency</label>
                  <input
                    type="number"
                    className="input"
                    onChange={onFrequencyChange(13, "slotFourteen")}
                    value={slots[13].adFrequency}
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
