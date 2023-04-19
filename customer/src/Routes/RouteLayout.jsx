import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarLayout from "../Layouts/NavbarLayout";
import AdsPage from "../pages/AdsPage/AdsPage";
import AnalyticsPage from "../pages/AnalyticsPage/AnalyticsPage";
import DevicePage from "../pages/DevicePage/DevicePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import UserDetails from "../pages/UserDetails/UserDetails";
import PrivateRoutingLayout from "./PrivateRoutingLayout";

const RouteLayout = () => {
  return (
    <>
      <Routes>
      <Route element={<PrivateRoutingLayout />}>

        <Route path="/" element={<NavbarLayout />}>
          <Route exact path="/" element={<AdsPage />} />
          <Route exact path="/analytics" element={<AnalyticsPage />} />
          <Route exact path="/devices" element={<DevicePage />} />
          <Route exact path="/user-details" element={<UserDetails />} />
        </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default RouteLayout;
