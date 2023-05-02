import { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../context/context";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useFetch from "../../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";

const ReportsPage = () => {
  const { userInfo } = useContext(Context);
  console.log(userInfo);
  const [info, setInfo] = useState({});
  const [reportloading, setreportloading] = useState(false)
  const [addata,setAdData] = useState({})
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/customer";
  const { data, loading } = useFetch(`/loadads/${userInfo._id}`);

  const [selectedAd, setSelectedAd] = useState({});
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const handleSelectChange = () => {
    if(data.ads.length>0){
      let selectedAdOption = data.ads[document.querySelector("#ad").value];
    setSelectedAd(selectedAdOption);
    console.log(selectedAdOption)

    }
  };
  const handleClick = async (e) => {

    e.preventDefault();
    try {
      setreportloading(true)
      if (selectedAd._id !== null && info.startDate && info.endDate) {
        const newReport = {
          ...info,operatorid: selectedAd.operator
        };
        const res = await axios.post(
          `${BASE_URL}/ad/${selectedAd.adWithId._id}`,
          newReport,
          config
        );
       
         setAdData(res.data);
        setreportloading(false)
      } else {
        alert("Please enter the correct details");
      }
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
    
           {
             
             data.ads?.map((itm, i) => (
              <option value={i}>{itm.name}</option>
            ))
           }
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
        Object.keys(addata).length !== 0 && (
          <div className="my-20">
            <table id="adreport" className="bg-white">
              <caption className="text-xl font-bold">Air-Time Report</caption>
              <tr>
                <th colSpan="2">Operator Name:</th>
                <th colSpan="6">{addata.operator.name} </th>
              </tr>
              <tr>
                <th colSpan="2">operator Email:</th>
                <th colSpan="6">{addata.operator.email}</th>
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
              {addata.groupedSlots?.map((itm, i) => (
                <tr>
                  {i === 0 && (
                    <td rowSpan={addata.groupedSlots.length}>{i + 1}</td>
                  )}
                  {i === 0 && (
                    <td rowSpan={addata.groupedSlots.length}>
                      {selectedAd.name}
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
              ))}
            </table>
           
          </div>
        )
      )} 
    </div>
  );
};

export default ReportsPage;
