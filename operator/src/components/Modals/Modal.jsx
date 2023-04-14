import React, { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Multiselect from "multiselect-react-dropdown";
import "./modal.css";
import { useContext } from "react";
import { Context } from "../../context/context";

const Modal = () => {
  const { loadDevices, devices, addAd } = useContext(Context);

  useEffect(() => {
    loadDevices();
  }, []);

  const [info, setinfo] = useState({});
  const handleChange = (e) => {
    setinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const [selectedDevices, setSelectedDevices] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newVideo = {
      ...info,
      devices: selectedDevices,
    };
    addAd(newVideo);
  };

  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="my-modal-3"
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
            <select
              className="select w-[80%] "
              name="session"
              onChange={handleChange}
            >
              <option disabled selected>
                Select Sessions
              </option>
              <option value="morning">Morning</option>
              <option value="noon">Noon</option>
              <option value="evening">Evening</option>
            </select>
            <div className="pb-6 button-section">
              <button className="btn add-video-btn" onClick={handleSubmit}>
                {" "}
                Add Video
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;
