import { Navigate, Outlet } from "react-router-dom";
const PrivateRoutingLayout = () => {
  let auth = { token: true };

  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutingLayout;
