import { useContext, useState } from "react"
import useFetch from "../../hooks/useFetch"
import axios from "axios";
import { Context } from "../../context/context";

const ReportsPage = () => {
    const { userInfo } = useContext(Context);
    console.log(userInfo)
    
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const BASE_URL = "http://localhost:5000/api/operator";
      const [id, setId] = useState("")
    const [info, setInfo] = useState({})
    const handleChange = (e) =>{
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(info);
    }
    const handleSelectChange = () => {
        setId(document.querySelector('#ad').value)
        console.log(id)
      }
    const handleClick = async(e)=>{
        e.preventDefault();
        try{
            const newReport = {
                ...info
            }
            const res = await axios.post(
                `${BASE_URL}/report/ad/${id}`,
                newReport,
                config
              );
        }
        catch(error){
            console.log(error)
        }

    }
    return(
        <div className="px-12 py-20">
            <h1 className="text-3xl font-bold mb-20">Reports</h1>
            <p>Please select the start date and end date </p>
            <form action="" >
                <div className="my-8">
                    <label htmlFor="">Select the advertaisement</label><br></br>
                    <select onChange={handleSelectChange} id="ad" className="w-[80%] border  border-[#ff8a00] px-2 bg-[white] rounded py-3 outline-none">
                        <option>Select Ad</option>

                            {userInfo.adsUnderOperator?.map((itm)=>(
                            <option value={itm.ad._id} >{itm.ad.name}</option>
                            ))}
                         </select>
                </div>
                <div className="my-8 flex gap-4 items-center">
                    <label htmlFor="">Start Date</label>
                    <input type="date" name="startDate" onChange={handleChange} className="border border-[#ff8a00] outline-none px-4 py-2 rounded"/>
                    <label htmlFor="">End Date</label>
                    <input type="date" name="endDate" onChange={handleChange}  className="border border-[#ff8a00] outline-none px-4 py-2 rounded"/>
                    <button className="device-gradient rounded px-4 py-2" onClick={handleClick}>Generate Report</button>
            
                </div>
                 </form>
            <div className="px-12 py-12">
                <table className="border bg-[white] my-8 "> 
                    <tr><td>Advertisement Name</td></tr>
                    <tr><td>URL</td></tr>
                    <tr><td>Customer Name</td></tr>
                    <tr><td>Customer Email</td></tr>
                    <tr><td>Operator Name</td></tr>
                    <tr><td>Operator Email</td></tr>

                </table>
               <div>
                   <h1 className="font-bold text-xl mb-4">Device wise analysis</h1>
                   <div className=" border rounded px-8 py-8">
                    <h1 className="font-bold text-lg">Device Name</h1>
                        <h1 className="font-bold text-lg">Device Location</h1>
                    <table className="border bg-[white] my-4 ">
                        
                        <tr className="bg-[grey]">
                            <th >Time Slot</th>
                            <th >No. of Times Played</th>
                        </tr>
                        <tr>
                            <td>9am to 10am</td>
                            <td>2</td>

                        </tr>
                        <tr>
                            <td>9am to 10am</td>
                            <td>2</td>

                        </tr>
                        <tr>
                            <td>9am to 10am</td>
                            <td>2</td>

                        </tr>
                        <tr>
                            <td>9am to 10am</td>
                            <td>2</td>

                        </tr>
                        <tr>
                            <td>9am to 10am</td>
                            <td>2</td>

                        </tr>
                        <tr>
                            <td>9am to 10am</td>
                            <td>2</td>

                        </tr>
                    </table>
                </div>
               </div>
            </div>
        </div>
    )
}

export default ReportsPage