import React, { useState, useEffect } from "react";
import CreatePostModal from "./CreatePostModal";
import { FaXTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { setLoading } from "../redux/uiSlice";
import LogoutModal from "./LogoutModal";
import { setUnreadCount } from "../redux/notificationSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * The Sidebar component provides the main navigation for the application.
 * It includes links to different sections, a logout button with a confirmation modal,
 * and a dynamic badge for unread notifications.
 */
const Sidebar = () => {
  // Get the logged-in user and unread notification count from the Redux store.
  const { user } = useSelector((store) => store.user);
  const { unreadCount } = useSelector((store) => store.notification);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage the visibility of the logout confirmation modal.
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // This effect runs on component mount and periodically fetches the unread
  // notification count to keep the badge in the UI up-to-date.
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // Only fetch if a user is logged in.
      if (user) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/notifications/unread-count`,
            {
              withCredentials: true,
            }
          );
          // Dispatch the fetched count to the Redux store.
          dispatch(setUnreadCount(res.data.count));
        } catch (error) {
          // We don't show a user-facing error here as it's a background task.
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };

    fetchUnreadCount(); // Fetch immediately when the component loads.
    const intervalId = setInterval(fetchUnreadCount, 30000); // And then check again every 30 seconds.

    // Cleanup function to stop the interval when the component unmounts.
    return () => clearInterval(intervalId);
  }, [user, dispatch]);

  /**
   * Handles the complete logout process, including showing a loading state
   * and redirecting the user.
   */
  const logoutHandler = async () => {
    setIsLogoutModalOpen(false); // Close the confirmation modal.
    dispatch(setLoading({ status: true, message: "Logging you out..." }));
    try {
      const res = await axios.get(`${API_BASE_URL}/user/logout`, {
        withCredentials: true,
      });
      dispatch(clearUser()); // Clear user data from the Redux store.
      toast.success(res.data.message);
      // Use a timeout to allow the user to see the success message before redirecting.
      setTimeout(() => {
        navigate("/login");
        dispatch(setLoading({ status: false }));
      }, 1500);
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
            {/* The notification badge is only rendered if there are unread notifications. */}
            {unreadCount > 0 && (
              <span className="absolute top-2 left-5 w-5 h-5 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-black">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <IoMdNotifications size="28px" />
            <h1 className="font-bold text-lg">Notifications</h1>
          </Link>
          {/* The profile link dynamically uses the logged-in user's ID. */}
          <Link
            to={`/home/profile/${user?._id}`}
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <FaUser size="28px" />
            <h1 className="font-bold text-lg">Profile</h1>
          </Link>
          {/* --- BOOKMARKS --- */}
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
          {/* This div opens the logout confirmation modal instead of logging out directly. */}
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

      {/* The LogoutModal is only rendered when isLogoutModalOpen is true. */}
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
