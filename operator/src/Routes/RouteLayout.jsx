import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutingLayout from "./PrivateRoutingLayout";
import NavbarLayout from "../Layouts/NavbarLayout";

import LoginPage from "../pages/LoginPage/LoginPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import GroupPage from "../pages/GroupPage/GroupPage";
import DevicePage from "../pages/DevicePage/DevicePage";
import AdsPage from "../pages/AdsPage/AdsPage";
import CustomerPage from "../pages/CustomerPage/CustomerPage";
import AdDetailPage from "../pages/AdDetailPage/AdDetailPage";
import DeviceDetailPage from "../pages/DeviceDetailPage/DeviceDetailPage";
import ReportsPage from "../pages/ReportPage/ReportsPage";
const RouteLayout = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutingLayout />}>
          <Route element={<NavbarLayout />} path="/">
            <Route path="/" element={<DashboardPage />} />
            <Route path="/groups" element={<GroupPage />} />
            <Route path="/devices" element={<DevicePage />}></Route>
            <Route path="/reports" element={<ReportsPage />}></Route>

            <Route path="/ads" element={<AdsPage />}></Route>
            <Route path="/customer" element={<CustomerPage />}></Route>
            <Route path="/ad/:id" element={<AdDetailPage />} />
            <Route path="/device/:id" element={<DeviceDetailPage />}> </Route>


          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default RouteLayout;
