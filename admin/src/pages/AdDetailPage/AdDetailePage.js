
import { AiFillCaretDown } from "react-icons/ai";
const AdDetailPage = () => {
    return(
        <div>
            <div className="device-gradient px-8 py-4">
                <h1 className="text-2xl font-bold text-white ">Device Name</h1>
            </div>

            <div className="px-12 py-12 flex  justify-between">
                <div className="text-lg">
                    <h1>Device Name : devicename</h1>
                    <h1>Device ID : deviceId</h1>

                    <h1>Location : area</h1>

                </div>
                <div className="text-base flex flex-col items-end">
                    <h1>Password : 12345678</h1>
                    <button className="bg-[#ffc300] text-white px-2 py-1 rounded text-sm">Reset Password</button>
                    <p className="text-[red] text-sm">Please note that resetting password will logout the device</p>
                </div>
            </div>
            <div className="px-12 py-4">

                <h1 className="text-xl font-bold pb-8">Slot Details</h1>

                <div className="px-8 py-4 bg-[#fff1c4]">
                    <h1 className="font-bold text-lg pb-4">SlotOne 9am to 10am</h1>
                    <div className="bg-[#ffe78a] py-4 px-8">
                        <h1 className="font-semibold">Advertisement 1</h1>
                        <div className="py-2 font-semibold">
                            <h1>Cadberry Diary Milk</h1>
                            <h1>Url: https://google.com/</h1>
                        </div>
                        <div className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title text-base flex items-center gap-3 font-medium">
                            Operator Details <AiFillCaretDown />
                            </div>
                            <div className="collapse-content">
                                <p>hello</p>
                            </div>
                        </div>
                        <div className="collapse">
                            <input type="checkbox" />
                            <div className="collapse-title text-base flex items-center gap-3 font-medium">
                                Customer Details  <AiFillCaretDown />
                            </div>
                            <div className="collapse-content">
                                <p>hello</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default AdDetailPage