import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";

const Home = () => {
  return (
    <div className="flex justify-between w-[85%] mx-auto">
        <Sidebar/>
        <Feed/>
        <Widgets/>
        
    </div>
  );
};

export default Home;
