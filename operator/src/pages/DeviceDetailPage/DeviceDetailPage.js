import { useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
const DeviceDetailPage = () => {
  const today = new Date();
  const [date, setDate] = useState(
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDay()}`
  );
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(`/device/${id}`);
  const [shedule, setShedule] = useState([]);
  const [sheduleLoading, setSheduleLoading] = useState(false);
  console.log(shedule);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/operator",
  });
  useEffect(() => {
    setSheduleLoading(true);
    axiosInstance
      .post(`/device/${id}`, { date: date }, config)
      .then((res) => {
        setShedule(res.data);
        setSheduleLoading(false);
      })
      .catch((err) => console.log(err));
  }, [date]);
  const handleDate = (val) => {
    if (val == "") {
      alert("please enter a date");
    } else {
      setDate(val);
    }
  };
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <ClipLoader color="#7605bc" />
        </div>
      ) : (
        data &&
        data != undefined && (
          <div>
            <div className="device-gradient px-8 py-4">
              <h1 className="text-2xl font-bold text-white ">{data.name}</h1>
            </div>

            <div className="px-12 py-12 ">
              <div className="text-lg border rounded px-4 py-2">
                <h1>Device Name : {data.name}</h1>
                <h1>Device ID : {data.deviceId}</h1>

                <h1>Location : {data.location}</h1>
              </div>
            </div>
            <div className="px-12 py-4">
              <div className="flex flex-col gap-4 items-start pb-12">
                <div className="flex flex-col gap-4 items-start">
                  <h1 className="text-lg">
                    Pick a date to show the slot details for that day
                  </h1>
                  <div className="flex gap-4">
                    <input
                      type="date"
                      id="date"
                      className="border px-4 py-2 outline-none rounded"
                      onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <button
                      className="border rounded px-4 py-2 device-gradient font-bold text-white"
                      onClick={() =>
                        handleDate(document.querySelector("#date").value)
                      }
                    >
                      Get slot details
                    </button>
                  </div>
                </div>
              </div>

              {sheduleLoading ? (
                <ClipLoader />
              ) : (
                <div>
                  <h1 className="text-xl font-bold">Slot details for {date}</h1>
                  <div>
                    {shedule.slots?.map((itm) => (
                      <div className="px-8 py-4 border rounded" key={itm.id}>
                        <h1 className="font-bold text-lg pb-4">{itm.name}</h1>
                        {itm.queue != null && 
                        <div>
                        {itm.queue.length !== 0 && (
                          itm.queue.map(
                            (obj, i) =>
                              obj.adFrequency !== 0 && (
                                <div
                                  className="bg-[#ffe78a] rounded-[10px] px-8 mb-4"
                                  key={i}
                                >
                                  <div className="py-1 font-semibold collapse">
                                    <input type="checkbox" />
                                    <h1 className="collapse-title flex text-xl items-center justify-between">
                                      {obj.ad.name} <AiFillCaretDown />
                                    </h1>
                                    <h1 className="px-4">Ad Frequency: {obj.adFrequency}</h1>

                                    <div className="collapse-content">
                                      <p>Operator Name: {obj.operator.name}</p>
                                      <p>
                                        Customer Name: {obj.ad.customer.name}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                          )
                        ) 
                        
                    }</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default DeviceDetailPage;
