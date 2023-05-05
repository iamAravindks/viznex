import { useContext, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { Context } from "../../context/context";
import ClipLoader from "react-spinners/ClipLoader";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ReportsPage = () => {
  const { userInfo } = useContext(Context);
  const { data: ads, loading, error, reFetch } = useFetch("/load-ads");
  const { data: devices, loading:deviceLoading } = useFetch("/load-devices");

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/operator";
  const [selectedAd, setSelectedAd] = useState({});
  const [data, setData] = useState({});
  const [devicedata, setdeviceData] = useState({});

  const [info, setInfo] = useState({});
  const [adInfo, setAdInfo] = useState([]);
  const [reportloading, setreportloading] = useState(false);
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const [deviceinfo, setdeviceInfo] = useState({});
  const handledeviceChange = (e) => {
    setdeviceInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelectChange = () => {
    let selectedAdOption = ads[document.querySelector("#ad").value];
    setSelectedAd(selectedAdOption);
  };
  const [selectedDevice, setSelectedDevice] = useState({});

  const handledeviceSelectChange = () => {
    let selectedAdOption = devices[document.querySelector("#device").value];
    setSelectedDevice(selectedAdOption);
    console.log(selectedDevice)
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setreportloading(true);
      if (selectedAd._id !== null && info.startDate && info.endDate) {
        const newReport = {
          ...info,
          operatorid: userInfo._id,
        };
        setAdInfo(ads.filter((obj) => obj._id === selectedAd._id));
        const res = await axios.post(
          `${BASE_URL}/report/ad/${selectedAd._id}`,
          newReport,
          config
        );
        setData(res.data);
      } else {
        alert("Please enter the correct details");
      }
      setreportloading(false);

    } catch (error) {
      console.log(error);
    }
  };
  const handledeviceClick = async (e) => {
    e.preventDefault();
    try {
      setreportloading(true);
      if (selectedDevice._id !== null && deviceinfo.from && deviceinfo.to) {
        const newReport = {
          ...deviceinfo,
          deviceId: selectedDevice._id
        };
        const res = await axios.post(
          'http://localhost:5000/api/device/ad-forecast',
          newReport,
          config
        );
        setdeviceData(res.data);
        console.log(devicedata)
        setreportloading(false);
      } else {
        alert("Please enter the correct details");

      }
      setreportloading(false);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-12 py-20">
      <h1 className="text-3xl font-bold mb-20">Reports</h1>
      <h1 className="text-xl font-bold">Advertaisement Report</h1>
      <p>
        Here you can create the report for a particular Ad you have published.
        Please select the time range that you want to create the report. To get
        more details about the ad on each devices and time slots, visit the ads
        page and select the particular ad.{" "}
      </p>
      <form action="">
        <div className="my-8">
          <label htmlFor="">Select the advertaisement</label>
          <br></br>
          <select
            onChange={handleSelectChange}
            id="ad"
            className="w-[80%] border  border-[#ff8a00] px-2 bg-[white] rounded py-3 outline-none"
          >
            <option>Select Ad</option>

            {ads?.map((itm, i) => (
              <option value={i}>{itm.ad.name}</option>
            ))}
          </select>
        </div>
        <div className="my-8 flex gap-4 items-center">
          <label htmlFor="">Start Date</label>
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            className="border border-[#ff8a00] outline-none px-4 py-2 rounded"
          />
          <label htmlFor="">End Date</label>
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            className="border border-[#ff8a00] outline-none px-4 py-2 rounded"
          />
          <button
            className="device-gradient rounded px-4 py-2"
            onClick={handleClick}
          >
            Generate Report
          </button>
        </div>
      </form>
      {reportloading ? (
        <div>
          <ClipLoader />
        </div>
      ) : (
        Object.keys(selectedAd).length !== 0 &&
        Object.keys(data).length !== 0 && (
          <div className="my-20">
            <table id="adreport" className="bg-white">
              <caption className="text-xl font-bold">Air-Time Report</caption>
              <tr>
                <th colSpan="2">Customer Name:</th>
                <th colSpan="6">{selectedAd.ad.customer.name}</th>
              </tr>
              <tr>
                <th colSpan="2">Customer Email:</th>
                <th colSpan="6">{selectedAd.ad.customer.email}</th>
              </tr>
              <tr>
                <th>Sl No</th>
                <th>Ads Name</th>
                <th>Device</th>
                <th>From</th>
                <th>To</th>
                <th>Scheduled Ad Count</th>
                <th>Air Time Count</th>
                <th>Balance</th>
              </tr>
              {data.groupedSlots?.map((itm, i) => {
                console.log(itm);
                return (
                  <tr>
                    {i === 0 && (
                      <td rowSpan={data.groupedSlots.length}>{i + 1}</td>
                    )}
                    {i === 0 && (
                      <td rowSpan={data.groupedSlots.length}>
                        {selectedAd.ad.name}
                      </td>
                    )}
                    <td>
                      {itm.device.name}({itm.device.location})
                    </td>
                    <td>{info.startDate}</td>
                    <td>{info.endDate}</td>
                    <td>{itm.sheduledFrequency}</td>
                    <td>{itm.totalSumPlayed}</td>
                    <td>{itm.sheduledFrequency - itm.totalSumPlayed}</td>
                  </tr>
                );
              })}
            </table>
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button px-4 py-2 rounded device-gradient my-8"
              table="adreport"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />
          </div>
        )
      )}

<h1 className="text-xl font-bold">Device Report</h1>
<form action="">
        <div className="my-8">
          <label htmlFor="">Select the Device</label>
          <br></br>
          <select
            onChange={handledeviceSelectChange}
            id="device"
            className="w-[80%] border  border-[#ff8a00] px-2 bg-[white] rounded py-3 outline-none"
          >
            <option>Select Device</option>

            {devices?.map((itm, i) => (
              <option value={i}>{itm.name}</option>
            ))}
          </select>
        </div>
        <div className="my-8 flex gap-4 items-center">
          <label htmlFor="">Start Date</label>
          <input
            type="date"
            name="from"
            onChange={handledeviceChange}
            className="border border-[#ff8a00] outline-none px-4 py-2 rounded"
          />
          <label htmlFor="">End Date</label>
          <input
            type="date"
            name="to"
            onChange={handledeviceChange}
            className="border border-[#ff8a00] outline-none px-4 py-2 rounded"
          />
          <button
            className="device-gradient rounded px-4 py-2"
            onClick={handledeviceClick}
          >
            Generate Report
          </button>
        </div>
      </form>

    </div>
  );
};

export default ReportsPage;
