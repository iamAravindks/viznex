import React from "react";
import { useContext } from "react";
import { Context } from "../../context/context";

const Loader = () => {
  const { loading } = useContext(Context);
  if (loading)
    return (
      <div className="absolute min-w-full grid place-items-center min-h-screen text-center bg-[#212121] text-white z-[1000]">
        Loading...
      </div>
    );
};

export default Loader;
