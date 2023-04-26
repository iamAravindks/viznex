import { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../context/context";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportsPage = () => {
  const { userInfo } = useContext(Context);
  console.log(userInfo);
  const generatePdf = (e) => {
    e.preventDefault();
    const input = document.getElementById("adReport");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.setFontSize(8);
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save("filename.pdf");
    });
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const BASE_URL = "https://api.viznx.in/api/operator";
  const [id, setId] = useState(null);
  const [data, setData] = useState({});
  const [info, setInfo] = useState({});
  const [adInfo, setAdInfo] = useState([]);
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(info);
  };
  const handleSelectChange = () => {
    setId(document.querySelector("#ad").value);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (id !== null && info.startDate && info.endDate) {
        const newReport = {
          ...info,
        };
        setAdInfo(userInfo.adsUnderOperator.filter((obj) => obj.ad._id === id));
        console.log(id);
        const res = await axios.post(
          `${BASE_URL}/report/ad/${id}`,
          newReport,
          config
        );
        setData(res.data);
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
      <p>Please select the start date and end date </p>
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

            {userInfo.adsUnderOperator?.map((itm) => (
              <option value={itm.ad._id}>{itm.ad.name}</option>
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
          {id !== null && (
            <button
              className="device-gradient rounded px-4 py-2"
              onClick={generatePdf}
            >
              Download PDF
            </button>
          )}
        </div>
      </form>
      <div className="px-12 py-12" id="adReport">
        {adInfo[0] != undefined && (
          <table className="border bg-[white] my-8 ">
            <tr>
              <td>
                <b>Advertisement Name :</b> {adInfo[0].ad.name}
              </td>
            </tr>
            <tr>
              <td>
                <b>URL :</b> {adInfo[0].ad.url}
              </td>
            </tr>
            <tr>
              <td>
                <b>Customer Name :</b> {adInfo[0].ad.customer.name}
              </td>
            </tr>
            <tr>
              <td>
                <b>Customer Email :</b> {adInfo[0].ad.customer.email}
              </td>
            </tr>
          </table>
        )}
        <div>
          {data.groupedSlots?.map((itm) => (
            <div>
              <div className=" border rounded px-8 py-8">
                <h1 className="font-bold text-lg">
                  Device Name : {itm.device.name}
                </h1>
                <h1 className="font-bold text-lg">
                  Device Location : {itm.device.location}
                </h1>
                <table className="border bg-[white] my-4">
                  <tr className="bg-[grey]">
                    <th>Time Slot</th>
                    <th>Dates</th>
                    <th>No. of Times Played</th>
                  </tr>
                  {itm.slots?.map((object) => (
                    <>
                      {object.slot.datesPlayed?.map((obj, i) => (
                        <tr>
                            {i == 0 && <td rowSpan={object.slot.datesPlayed.length}>{}</td>}
                          <td>{obj.date.slice(0, 10)}</td>
                          <td>{obj.noOfTimesPlayedOnDate}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
