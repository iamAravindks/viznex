import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext, useMemo } from "react";
import "./loginpage.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/context";
const LoginPage = () => {
  const { login, userInfo } = useContext(Context);
    const navigate = useNavigate();
    const memoizedUserInfo = useMemo(() => userInfo, [userInfo]);
    useEffect(() => {
      if (memoizedUserInfo?._id) {
        navigate("/");
      }
    }, [memoizedUserInfo]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password:""
      });

      const onHandlerChange = (e) => {
        setFormData((prevState) => {
          return { ...prevState, [e.target.id]: e.target.value };
        });
      };

      const onSubmitHandler = (e) => {
        e.preventDefault();
        login(formData.name, formData.email, formData.password);
      };
  return (
    <div className="relative flex flex-row">
      <div className="circle"></div>
      <div className="w-1/2 min-h-screen content-section pt-52 pl-28 ">
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-1 form-section form-control w-80">
          <h1 className="text-4xl font-bold heading">Welcome back</h1>
          <p className="text-subText">
            Welcome back, Please enter your details
          </p>
          <div className="flex flex-col gap-1 mt-16 input-section">
            <div className="relative mb-5 field-holder">
              <input
                id="name"
                type="text"
                onChange={onHandlerChange}
                required
                className="border-0 border-b-2 rounded-none file-input min-w-max w-80 focus:outline-none border-b-inputBorder"
              />
              <span className="absolute left-0 text-subText top-1 label">
                Username
              </span>
            </div>
            <div className="relative mb-5 field-holder">
              <input
                id="email"
                type="text"
                onChange={onHandlerChange}
                required
                className="border-0 border-b-2 rounded-none file-input min-w-max w-80 focus:outline-none border-b-inputBorder"
              />
              <span className="absolute left-0 text-subText top-1 label">
                E-mail
              </span>
            </div>
            <div className="relative field-holder ">
              <input
                id="password"
                type="password"
                required
                onChange={onHandlerChange}
                className="border-0 border-b-2 rounded-none file-input min-w-max w-80 focus:outline-none border-b-inputBorder"
              />
              <span className="absolute left-0 text-subText top-1 label">
                Password
              </span>
            </div>

            <Link
              className="font-semibold text-right text-linkColor"
              to="/login"
            >
              Forgot Password ?
            </Link>
            <button className="mt-8 capitalize border-0 btn login-btn">
              Login
            </button>
          </div>
          <p className="font-medium text-signUpTextColor">
            Don't have an account?{" "}
            <span>
              <Link className="font-semibold text-linkColor" to="/login">
                Sign up
              </Link>
            </span>
          </p>
        </form>
      </div>
      <div className="flex items-start justify-end w-1/2 min-h-screen design-section ">
        <img src="images/logo.svg" alt="logo" />
      </div>
    </div>
  );
};

export default LoginPage;
