import React, { useContext } from "react";
import { Context } from "../../context/context";
import ReactPlayer from "react-player";
import useFetch from "../../hooks/useFetch";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
const AdsPage = () => {
  const { userInfo } = useContext(Context);
  console.log(userInfo);
  const { data, loading } = useFetch(`/loadads/${userInfo._id}`);
  console.log(data);
  return (
    <div className="pt-20 px-20">
      <div>
        <h1 className="text-3xl font-bold">Your advertisements</h1>

        <div>
          {loading ? (
            <div className="flex justify-center my-40">
              <ClipLoader />{" "}
            </div>
          ) : (
            <div className="flex gap-8 flex-wrap">
              {data.ads?.map((itm) => (
                <div className=" rounded  my-8 flex-col justify-between border rounded overflow-hidden">
                   <div className="">
                    <ReactPlayer url={itm.url} width="400px" height="250px" />
                  </div>
                  <div className="my-8  px-4">
                    <h1 className="font-bold text-2xl">{itm.name}</h1>
                    <Link to={`/ad/${itm.adWithId._id}`}>
                      {" "}
                      <button className="px-4 py-2 bg-[#6b7fdb] font-bold text-white rounded my-4">
                        View statistics
                      </button>
                    </Link>
                  </div>
                 
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsPage;
