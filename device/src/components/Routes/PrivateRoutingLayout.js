import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../../context/context";
const PrivateRoutingLayout = () => {
  const { userInfo } = useContext(Context);

  return userInfo?._id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutingLayout;
