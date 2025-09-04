import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import useGetProfile from "../hooks/useGetProfile";
import CreatePostModal from "./CreatePostModal";
import { closeCreatePostModal } from "../redux/uiSlice";

const Home = () => {
  const { user, isLoading } = useSelector((store) => store.user);
  const { isCreatePostModalOpen } = useSelector((store) => store.ui);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetProfile();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) {
    // Show a loading screen or return null to wait for redirect
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    // This is the simplified flex container for the whole page layout.
    <div className="flex justify-center w-full sm:max-w-6xl sm:mx-auto">
      <Sidebar />
      <Outlet />
      <Widgets />

      {/* --- ADD THIS CONDITIONAL RENDER --- */}
      {isCreatePostModalOpen && (
        <CreatePostModal onClose={() => dispatch(closeCreatePostModal())} />
      )}
    </div>
  );
};

export default Home;
