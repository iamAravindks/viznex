import React from "react";
import { Link } from "react-router-dom";
import "./userdetails.css";

const UserDetails = () => {
  return (
    <div className="flex pt-11 pl-9">
      <div className="w-[65%] details-section">
        <h1 className="company-name font-bold text-[#4C4C4C] text-4xl">
          Himalaya Wellness Company
        </h1>
        <div className="field-section flex flex-col max-w-max mt-12">
          <div className="input-container flex mb-9">
            <div className="input-icons flex w-[43px] h-[36px] ">
              <img src="images/userdetails-color.svg" className="" alt="" />
            </div>
            <input
              className="bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[5px] focus-within:outline-none min-w-[272px] pl-5"
              type="text"
            />
          </div>

          <div className="input-container flex">
            <div className="input-icons flex w-[43px] h-[36px] justify-center">
              <img src="images/passlock-color.svg" className="" alt="" />
            </div>
            <input
              className="bg-white shadow-[0_0_5px_rgba(0,0,0,0.25)] rounded-[5px] focus-within:outline-none min-w-[272px] pl-5"
              type="text"
            />
          </div>

          <Link className="text-[#5940F5] text-right mt-[10px] text-[12px]">
            Change Password
          </Link>
        </div>
        <div className="contact-details mt-20">
          <div className="address mb-9">
            <h1 className="text-[20px] text-[#4c4c4c] font-bold mb-[10px]">
              Address
            </h1>
            <p className="font-medium text-[19px] text-[#828282]">
              Himalaya Wellness Company, <br /> Makali, Bengaluru - 562162
            </p>
          </div>
          <div className="phone mb-11">
            <h1 className="text-[20px] text-[#4c4c4c] font-bold mb-[10px]">
              Contact Number
            </h1>
            <p className="font-medium text-[19px] text-[#828282]">
              +91 89518 91930, +91 89518 91931{" "}
            </p>
          </div>
          <div className="email">
            <h1 className="text-[20px] text-[#4c4c4c] font-bold mb-[10px]">
              Email Address
            </h1>
            <p className="font-medium text-[19px] text-[#828282]">
              contact@himalayawellness.com{" "}
            </p>
          </div>
        </div>
      </div>
      <div className="upload-section flex flex-col  min-w-[45%]">
        <div className="profile-photo self-end mr-32">
          <h1>Profile Photo</h1>
          <div className="section border-dashed border-4  flex items-center justify-center w-[241px] h-[241px] gap-4">
            <div className="upload-img flex w-[36.67px] h-[36.67px] bg-[#6b7fdb52] items-center pt-2 rounded-full">
              <img src="images/upload.svg" className=" " alt="" />
            </div>
            <div className="link-section">
              <Link className="text-center bg-red-600">
                <p className="text-[#6B7FDB] text-[14.1px] font-bold">
                  Click to upload
                </p>
                <p className="text-[10.28px] text-[#828282] font-medium">
                  or just drag and drop
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
