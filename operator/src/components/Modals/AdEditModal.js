import axios from "axios";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Multiselect from "multiselect-react-dropdown";

const AdEditModal = ({
  setEditModalOpen,
  editData,
  editDataLoading,
  devices,
}) => {
  const [info, setinfo] = useState({});
  useEffect(() => {
    if (editData?.ad) {
      setinfo(prev => ({
        ...prev,
        startDate: editData.ad.deployedDevices[0].startDate.slice(0, 10),
        endDate: editData.ad.deployedDevices[0].endDate.slice(0, 10)
      }));
    }
  }, [editData]);
  
  console.log(editData);
  const handleChange = (e) => {
    setinfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const [selectedDevices, setSelectedDevices] = useState()
  useEffect(()=>{
    if (editData && devices && Object.keys(editData).length !== 0) {
      const deviceIds = editData.groupedSlots.map((itm) => itm._id);
      setSelectedDevices(deviceIds)
    }else{
      setSelectedDevices([])

    }
  },[editData])
  console.log(selectedDevices);
  const onFrequencyChange = (v, id) => (e) => {
    if (document.getElementById(id).checked == true) {
      const newSlots = [...slots]; // Create a copy of the slots array
      const slotIndex = newSlots.findIndex((slot) => slot.slot === id); // Find the index of the slot to be updated
      if (slotIndex !== -1 && e.target.value > 0) {
        newSlots[slotIndex] = { ...newSlots[slotIndex], adFrequency: e.target.value }; // Update the ad frequency of the slot
        setslots(newSlots); // Update the state with the updated slots array
      }
    }
  };
  const [slots, setslots] = useState([]);
  useEffect(() => {
    setslots(editData.slotsWithFrequencies);
    console.log(slots);
  }, [editData]);
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
  const [msg, setmsg] = useState("");
  const [showClip, setShowClip] = useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/operator";
  const handleSubmit = async (e) => {
    setmsg("");

    e.preventDefault();
    setShowClip(true);
    try {
      const newVideo = {
        ...info,
        ad:editData.ad.ad._id,
        customerEmail:editData.ad.ad.customer.email,
        devices: selectedDevices,
        slotsWithFrequencies: slots,
      };
      const res = await axios.patch(
        `${BASE_URL}/update-queue`,
        newVideo,
        config
      );

      setEditModalOpen(false)
    } catch (error) {
      setmsg(error.response.data.message);
    }
    setShowClip(false);
  };

  return (
    <div className="w-[50%] overflow-y-auto	overflow-x-hidden fixed top-[50%] z-[10000] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[70vh] bg-white rounded-[20px] shadow-2xl ">
      <div className="device-gradient px-8 py-8 flex sticky top-0 w-full right-0 justify-between rounded-t-[20px]">
        <h1 className="text-xl font-bold text-white">Edit Queue</h1>
        <h1
          onClick={() => setEditModalOpen(false)}
          className="text-white cursor-pointer font-extrabold text-2xl"
        >
          x
        </h1>
      </div>
      {editDataLoading ? (
        <div className="flex justify-center my-20">
          <ClipLoader />
        </div>
      ) : (
        editData &&
        devices && (
          <div className="px-8 py-8">
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
                  defaultValue={editData.ad.ad.name}
                />
              </div>

              <div className=" input-container  w-[80%]">
                <h1>URL of the advertisement</h1>
                <input
                  id="videolink"
                  type="text"
                  placeholder="Video Link"
                  className="w-full input"
                  name="url"
                  defaultValue={editData.ad.ad.url}
                  onChange={handleChange}deviceIds
                />
              </div>

              <div className="flex-col items-center gap-3 input-container  py-12  min-w-[80%]">
                <label htmlFor="">
                  Select the devices to publish this advertisement
                </label>
                <Multiselect
                  options={devices}
                  displayValue="name"
                  selectedValues={editData.groupedSlots}
                  onSelect={(selectedList, selectedItem) =>
                    setSelectedDevices([...selectedDevices, selectedItem._id])
                  }
                  onRemove={(selectedList, removedItem) => {
                    setSelectedDevices((current) =>
                      current.filter((elm) => elm !== removedItem._id)
                    );
                  }}
                />
              </div>
              <div className=" input-container  w-[80%]">
                <h1>Start Date</h1>
                {editData.ad.deployedDevices.length > 0 && (
                  <input
                    id="startdate"
                    type="date"
                    name="startDate"
                    onChange={handleChange}
                    className="w-full input"
                    defaultValue={editData.ad.deployedDevices[0].startDate.slice(
                      0,
                      10
                    )}
                  />
                )}
              </div>
              <div className="input-container w-[80%]">
                <h1 htmlFor="enddate">End Date</h1>
                <input
                  id="enddate"
                  type="date"
                  name="endDate"
                  defaultValue={editData.ad.deployedDevices[0].endDate.slice(
                    0,
                    10
                  )}
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
                      checked={slots  && slots.find(item => item.slot === "slotOne")?.adFrequency > 0}

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
                      value={slots &&
                       slots.find((item) => item.slot === "slotOne")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotOne")}

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
                      checked={slots && slots.find(item => item.slot === "slotTwo")?.adFrequency > 0}

                    />
                    <label htmlFor="">10am to 11am </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(1, "slotTwo")}
                      value={                        slots && slots.find((item) => item.slot === "slotTwo")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotTwo")}

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
                      checked={slots && slots.find(item => item.slot === "slotThree")?.adFrequency > 0}

                    />
                    <label htmlFor="">11am to 12pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(2, "slotThree")}
                      value={
                       slots && slots.find((item) => item.slot === "slotThree")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotThree")}

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
                      checked={slots && slots.find(item => item.slot === "slotFour")?.adFrequency > 0}

                    />
                    <label htmlFor="">12pm to 1pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(3, "slotFour")}
                      value={
                       slots && slots.find((item) => item.slot === "slotFour")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotFour")}

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
                      checked={slots && slots.find(item => item.slot === "slotFive")?.adFrequency > 0}

                    />
                    <label htmlFor="">1pm to 2pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(4, "slotFive")}
                      value={
                       slots && slots.find((item) => item.slot === "slotFive")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotFive")}

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
                      checked={slots && slots.find(item => item.slot === "slotSix")?.adFrequency > 0}

                    />
                    <label htmlFor="">2pm to 3pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(5, "slotSix")}
                      value={
                       slots && slots.find((item) => item.slot === "slotSix")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotSix")}

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
                      checked={slots && slots.find(item => item.slot === "slotSeven")?.adFrequency > 0}

                    />
                    <label htmlFor="">3pm to 4pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(6, "slotSeven")}
                      value={
                       slots && slots.find((item) => item.slot === "slotSeven")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotSeven")}

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
                      checked={slots && slots.find(item => item.slot === "slotEight")?.adFrequency > 0}

                    />
                    <label htmlFor="">4pm to 5pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(7, "slotEight")}
                      value={
                       slots && slots.find((item) => item.slot === "slotEight")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotEight")}

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
                      checked={slots && slots.find(item => item.slot === "slotNine")?.adFrequency > 0}

                    />
                    <label htmlFor="">5pm to 6pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(8, "slotNine")}
                      value={
                       slots && slots.find((item) => item.slot === "slotNine")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotNine")}

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
                      checked={slots && slots.find(item => item.slot === "slotTen")?.adFrequency > 0}

                    />
                    <label htmlFor="">6pm to 7pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(9, "slotTen")}
                      value={
                       slots && slots.find((item) => item.slot === "slotTen")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotTen")}

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
                      checked={slots && slots.find(item => item.slot === "slotEleven")?.adFrequency > 0}

                    />
                    <label htmlFor="">7pm to 8pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(10, "slotEleven")}
                      value={
                       slots && slots.find((item) => item.slot === "slotEleven")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotEleven")}

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
                      checked={slots && slots.find(item => item.slot === "slotTwelve")?.adFrequency > 0}

                    />
                    <label htmlFor="">8pm to 9pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(11, "slotTwelve")}
                      value={
                       slots && slots.find((item) => item.slot === "slotTwelve")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotTwelve")}

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
                      checked={slots && slots.find(item => item.slot === "slotThirteen")?.adFrequency > 0}

                    />
                    <label htmlFor="">9pm to 10pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(12, "slotThirteen")}
                      value={
                       slots && slots.find((item) => item.slot === "slotThirteen")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotThirteen")}

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
                      checked={slots && slots.find(item => item.slot === "slotFourteen")?.adFrequency > 0}

                    />
                    <label htmlFor="">10pm to 11pm </label>{" "}
                  </div>
                  <div className="flex gap-4 px-7">
                    <label htmlFor="">Ad frequency</label>
                    <input
                      type="number"
                      className="border px-2  rounded"
                      onChange={onFrequencyChange(13, "slotFourteen")}
                      value={
                       slots && slots.find((item) => item.slot === "slotFourteen")
                          ?.adFrequency || 0
                      }
                      disabled={slots && !slots.some((item) => item.slot === "slotFourteen")}

                    />{" "}
                  </div>
                </div>
              </div>
              <div className="pb-6 button-section flex items-center gap-4">
                <button
                  className="btn add-video-btn"
                  htmlFor="my-modal-3"
                  onClick={handleSubmit}
                >
                  Update Queue
                </button>
                 {showClip && (
              <span className="flex  gap-4 items-center">
                <ClipLoader color="#b600ff" /> Updating Ad{" "}
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
        )
      )}
    </div>
  );
};

export default AdEditModal;
