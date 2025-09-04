import React from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CreatePostModal from "./CreatePostModal";
import { closeCreatePostModal } from "../redux/uiSlice";

const Home = () => {
  const { isCreatePostModalOpen } = useSelector((store) => store.ui);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-center w-full sm:max-w-6xl sm:mx-auto">
      <Sidebar />
      <Outlet />
      <Widgets />

      {isCreatePostModalOpen && (
        <CreatePostModal onClose={() => dispatch(closeCreatePostModal())} />
      )}
    </div>
  );
};

export default Home;
