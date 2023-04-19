import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../context/context";
const PrivateRoutingLayout = () => {

  const { userInfo } = useContext(Context);
console.log(userInfo)
  return userInfo?._id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutingLayout;
