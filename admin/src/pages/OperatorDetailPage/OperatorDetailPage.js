
const OperatorDetailPage = () => {
    return(
        <div className="  ">
        <div className="">
              <div className="flex justify-between px-12 py-8  text-white operator-gradient" >
              <div className="">
                <h1 className="text-2xl font-bold">Operator Name</h1>
                <p>Location</p>
              </div>
              </div>
  
              <div className="px-12 py-8">
                <h1 className="text-lg font-bold pb-8">Ads under Operator</h1>

                <div>
                    <div className="bg-[#e3d0ff] rounded px-4 py-2">
                        <div className="flex justify-between py-4">
                            <h1 className="font-bold">Cadberry Dairy Milk</h1>
                            <p>URL: HBWJBSCWB</p>
                        </div>
                        <div>
                            <h1 className="font-semibold">Deployed Devices</h1>
                            <div className="py-2 flex gap-4 flex-wrap">
                                <span className="bg-[#9f00ff] px-4 py-1 text-white font-bold rounded">Device name</span>
                                <span className="bg-[#9f00ff] px-4 py-1 text-white font-bold rounded">Device name</span>
                                <span className="bg-[#9f00ff] px-4 py-1 text-white font-bold rounded">Device name</span>
                                <span className="bg-[#9f00ff] px-4 py-1 text-white font-bold rounded">Device name</span>
                                <span className="bg-[#9f00ff] px-4 py-1 text-white font-bold rounded">Device name</span>


                            </div>
                        </div>
                    </div>
                </div>
              </div>
              
        
        </div>
      </div>
    )
}

export default OperatorDetailPage