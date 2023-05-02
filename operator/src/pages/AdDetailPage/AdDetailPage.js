import { useLocation } from "react-router-dom";

import { Context } from "../../context/context";
import ClipLoader from "react-spinners/ClipLoader";
import { BarChart } from "../../components/Charts/BarChart";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const AdDetailPage = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  const formattedDate = `${year}-${month}-${day}`;
  const { getTimeSlot } = useContext(Context);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [sheduleLoading, setSheduleLoading] = useState(false);

  const [datereq, setDatereq] = useState(formattedDate);
  const [data, setdata] = useState(null);
  const handleDateChange = (e) => {
    setDatereq(e.target.value);
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/operator";

  useEffect(() => {
    setSheduleLoading(true);

    const res = axios
      .post(
        `${BASE_URL}/load-devices /${id}`,
        {
          datereq: datereq,
        },
        config
      )
      .then((res) => {
        setdata(res.data);
        setSheduleLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleGetad = (val) => {
    setDatereq(val);
  };

  return (
    <div>
      <div>
        {sheduleLoading ? (
          <div className="flex justify-center my-20">
            <ClipLoader />
          </div>
        ) : (
          data && (
            <div>
              <div className="device-gradient px-12 py-8">
                <h1 className="font-bold text-3xl">{data.ad.ad.name}</h1>
              </div>
              <div className="px-12 py-8 ">
                <div className="flex gap-[10%]">
                  <div className="border rounded px-8 py-8 w-[45%]">
                    <h1 className="font-semibold text-xl pb-4">
                      Customer Details
                    </h1>
                    <div>
                      <h1>
                        <b>Customer Name : {data.ad.ad.customer.name}</b>{" "}
                      </h1>
                      <h1>
                        <b>Customer Email :{data.ad.ad.customer.email}</b>{" "}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="my-28">
                  <h1 className="font-bold text-3xl mb-4">
                    Date wise Ad report
                  </h1>
                  <label htmlFor="">
                    Select a particular date to show the ad report for that day
                  </label>
                  <div className="my-4 flex gap-4">
                    <input
                      type="date"
                      className="border border-[orange] rounded px-4 py-2"
                      id="datereq"
                      min={data.ad.deployedDevices[0].startDate.slice(0, 10)}
                      max={data.ad.deployedDevices[0].endDate.slice(0, 10)}
                    />
                    <button
                      className="device-gradient px-4 py-1 rounded"
                      onClick={() =>
                        handleGetad(document.querySelector("#datereq").value)
                      }
                    >
                      Get details
                    </button>
                  </div>
                  <h1 className="text-xl font-semibold">
                    Deployed Devices and statistics for {datereq}
                  </h1>
                  <div className="my-4">
                    {data.groupedSlots &&
                      data.groupedSlots.map((itm, i) => (
                        <div className="border rounded px-8 py-4">
                          <h1 className="font-semibold text-xl pb-2">
                            Device {itm.deviceId}
                          </h1>
                          <hr />
                          <div className="flex">
                            <div className="w-[60%] max-h-[300px]">
                              <BarChart
                                obj={data.frequency[0]}
                                count={data.timesPlayedOnDateArray[i]}
                              />
                            </div>
                            <div className="w-[40%]">
                              <table className="bg-[white] text-xs">
                                <tr>
                                  <th>Slot</th>
                                  <th>Sheduled frequency</th>
                                  <th>Air time count</th>
                                  <th>Balance</th>
                                </tr>
                                {data.frequency[0]?.map((object, ind) => (
                                  <tr>
                                    <td>
                                      {getTimeSlot(
                                        `slot${ind + 1}`.trim().toLowerCase()
                                      )}
                                    </td>
                                    <td>{object}</td>
                                    <td>
                                      {data.timesPlayedOnDateArray[i][ind]}
                                    </td>
                                    <td>
                                      {object -
                                        data.timesPlayedOnDateArray[i][ind]}
                                    </td>
                                  </tr>
                                ))}
                                <caption className="font-bold my-2">
                                  Air time Ad Count
                                </caption>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdDetailPage;
