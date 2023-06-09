import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarLayout from "../Layouts/NavbarLayout";
import AdDetailsPage from "../pages/AdDetailsPage/AdDetailsPage";
import AdsPage from "../pages/AdsPage/AdsPage";
import AnalyticsPage from "../pages/AnalyticsPage/AnalyticsPage";
import DevicePage from "../pages/DevicePage/DevicePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ReportsPage from "../pages/ReportPage/ReportsPage";
import UserDetails from "../pages/UserDetails/UserDetails";
import PrivateRoutingLayout from "./PrivateRoutingLayout";

const RouteLayout = () => {
  return (
    <>
      <Routes>
      <Route element={<PrivateRoutingLayout />}>

        <Route path="/" element={<NavbarLayout />}>
          <Route exact path="/" element={<AdsPage />} />
          <Route exact path="/ad/:id" element={<AdDetailsPage />} />

          <Route exact path="/analytics" element={<AnalyticsPage />} />
          <Route exact path="/devices" element={<DevicePage />} />
          <Route exact path="/user-details" element={<UserDetails />} />
          <Route exact path="/reports" element={<ReportsPage />} />

        </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default RouteLayout;
