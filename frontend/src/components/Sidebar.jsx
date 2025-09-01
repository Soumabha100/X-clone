import React, { useState, useEffect } from "react";
import CreatePostModal from "./CreatePostModal";
import { FaXTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch, FaUser, FaHeart, FaBookmark } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { setLoading } from "../redux/uiSlice";
import LogoutModal from "./LogoutModal";
import { setUnreadCount } from "../redux/notificationSlice";

// Use your Vercel URL for the deployed version
const API_BASE_URL = "/api/v1";

/**
 * The Sidebar component provides the main navigation for the application.
 */
const Sidebar = () => {
  const { user } = useSelector((store) => store.user);
  const { unreadCount } = useSelector((store) => store.notification);
  const dispatch = useDispatch();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/notifications/unread-count`,
            {
              withCredentials: true,
            }
          );
          dispatch(setUnreadCount(res.data.count));
        } catch (error) {
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, [user, dispatch]);

  /**
   * Handles the complete logout process.
   */
  const logoutHandler = async () => {
    setIsLogoutModalOpen(false);
    try {
      const res = await axios.get(`${API_BASE_URL}/user/logout`, {
        withCredentials: true,
      });

      dispatch(clearUser());
      toast.success(res.data.message);

      // Force a full page reload to the login screen to clear all state.
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
      dispatch(setLoading({ status: false }));
    }
  };

  return (
    <>
      <div className="w-[20%] sticky top-0 h-screen">
        <div className="ml-5 mt-3">
          <Link to="/home">
            <FaXTwitter size={32} />
          </Link>
        </div>
        <div className="mt-4">
          {/* Navigation Links */}
          <Link
            to="/home"
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <GoHomeFill size="28px" />
            <h1 className="font-bold text-lg">Home</h1>
          </Link>
          <Link
            to="/home/explore"
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <FaSearch size="28px" />
            <h1 className="font-bold text-lg">Explore</h1>
          </Link>
          <Link
            to="/home/notifications"
            className="relative flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            {unreadCount > 0 && (
              <span className="absolute top-2 left-5 w-5 h-5 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-black">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <IoMdNotifications size="28px" />
            <h1 className="font-bold text-lg">Notifications</h1>
          </Link>
          <Link
            to={`/home/profile/${user?._id}`}
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <FaUser size="28px" />
            <h1 className="font-bold text-lg">Profile</h1>
          </Link>
          <Link
            to="/home/bookmarks"
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <FaBookmark size="28px" />
            <h1 className="font-bold text-lg">Bookmarks</h1>
          </Link>
          <Link
            to="/premium"
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <FaHeart size="28px" />
            <h1 className="font-bold text-lg">Premium</h1>
          </Link>
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <RiLogoutBoxRLine size="28px" />
            <h1 className="font-bold text-lg">Logout</h1>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="w-full py-3 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {isLogoutModalOpen && (
        <LogoutModal
          onConfirm={logoutHandler}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}

      {isPostModalOpen && (
        <CreatePostModal onClose={() => setIsPostModalOpen(false)} />
      )}
    </>
  );
};
export default Sidebar;
