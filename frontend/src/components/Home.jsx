import React from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { Outlet } from "react-router-dom";

const Home = () => {``
  return (
    <div className="flex justify-between w-[85%] mx-auto">
        <Sidebar/>
        <Outlet />
        <Widgets/>
        
    </div>
  );
};

export default Home;
