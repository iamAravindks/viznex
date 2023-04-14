import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Context } from "../../context/context";

const Error = () => {
  const { error, clearError } = useContext(Context);

  useEffect(() => {
    let timeOut;
    if (error) {
      setTimeout(() => {
        clearError();
      }, 3000);
    }

    return () => clearTimeout(timeOut);
  }, [error]);

  if (!error) return <></>;
  return (
    <div className="absolute alert alert-error shadow-lg z-[10000] m-0 max-w-[600px] right-10 top-10 ">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );
};

export default Error;
