import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutingLayout from "./PrivateRoutingLayout";
import NavbarLayout from "../Layouts/NavbarLayout";

import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import GroupPage from "../pages/GroupPage/GroupPage";
import DevicePage from "../pages/DevicePage/DevicePage";
import AdDetailPage from "../pages/AdDetailPage/AdDetailePage";
import OperatorDetailPage from "../pages/OperatorDetailPage/OperatorDetailPage";
const RouteLayout = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutingLayout />}>
          <Route element={<NavbarLayout />} path="/">
{/*             <Route path="/" element={<DashboardPage />} />
 */}    
{/*  <Route path="/" element={<AdDetailPage />} />        
 */} <Route path="/operators" element={<GroupPage />} />
 <Route path="/" element={<OperatorDetailPage />} /> 
            <Route path="/devices" element={<DevicePage />}></Route>
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default RouteLayout;
