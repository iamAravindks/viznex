import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Sidebar } from "../components/Navigation/Navigation.jsx";

const NavbarLayout = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="ml-32 pl-7">
        <Outlet />
      </div>
    </>
  );
};

export default NavbarLayout;
