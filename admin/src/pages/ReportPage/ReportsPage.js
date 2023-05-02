import axios from "axios";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

import ClipLoader from "react-spinners/ClipLoader";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const ReportsPage = () => {
  const { data:operators, loading, reFetch } = useFetch("/load-admin-operators");
  const [info, setInfo] = useState({});
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/admin";
  const [adsd, setAds] = useState([])
  useEffect(() => {
    const fetchAds = async () => {
      if(info && info.opId){
        const res = await axios.get(`${BASE_URL}/operator/${info.opId}`, config)
        setAds(res.data)
      }
    }
    fetchAds()
  }, [info])
  const [reportloading, setreportloading] = useState(false);
const [reportData, setReportData] = useState({})
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      setreportloading(true);
      if (info.adId !== null && info.opId !== null && info.startDate && info.endDate) {
        const newReport = {
          ...info
        };
        const res = await axios.post(
          `${BASE_URL}/report/ad/`,
          newReport,
          config
        );
        setReportData(res.data);
        setreportloading(false);
      } else {
        alert("Please enter the correct details");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log(reportData)
 
  return( 
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
          <label htmlFor="">Select the Operator</label>
          <br></br>
          <select
            onChange={handleChange}
             id="op" name="opId"
            className="w-[80%] border  border-[#ff8a00] px-2 bg-[white] rounded py-3 outline-none"
          >
            <option>Select Operator</option>

            {operators?.map((itm, i) => (
              <option value={itm._id}>{itm.name}</option>
            ))}
          </select>
        </div>
        <div className="my-8">
          <label htmlFor="">Select the Ad</label>
          <br></br>
          <select
            onChange={handleChange}
             id="ad" name="adId"
            className="w-[80%] border  border-[#ff8a00] px-2 bg-[white] rounded py-3 outline-none"
          >
            <option>Select Ad</option>

            {adsd?.adsUnderOperator && adsd.adsUnderOperator.map((itm, i) => (
              <option value={itm._id}>{itm.ad.name}</option>
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
                Object.keys(reportData).length !== 0 && (
          <div className="my-20">
            <table id="adreport" className="bg-white">
              <caption className="text-xl font-bold">Air-Time Report</caption>
              <tr>
                <th colSpan="2">Customer Name:</th>
                <th colSpan="6">{reportData.ad.ad.customer.name}</th>
              </tr>
              <tr>
                <th colSpan="2">Customer Email:</th>
                <th colSpan="6">{reportData.ad.ad.customer.email}</th>
              </tr>
              <tr>
                <th colSpan="2">Operator Name:</th>
                <th colSpan="6">{reportData.operator.name}</th>
              </tr>
              <tr>
                <th colSpan="2">Operator Email:</th>
                <th colSpan="6">{reportData.operator.email}</th>
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
              {reportData.groupedSlots?.map((itm, i) => {
                console.log(itm);
                return (
                  <tr>
                    {i === 0 && (
                      <td rowSpan={reportData.groupedSlots.length}>{i + 1}</td>
                    )}
                    {i === 0 && (
                      <td rowSpan={reportData.groupedSlots.length}>
                        {reportData.ad.ad.name}
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
    </div>  )
}
 
export default ReportsPage



