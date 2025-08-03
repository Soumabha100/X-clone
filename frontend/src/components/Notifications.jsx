import React, { useState, useEffect } from "react"; // Import useEffect
import { FaXTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { setLoading } from "../redux/uiSlice";
import LogoutModal from "./LogoutModal";
import { setUnreadCount } from "../redux/notificationSlice"; // Import the action

const API_BASE_URL = "http://localhost:8000/api/v1";

const Sidebar = () => {
  const { user } = useSelector((store) => store.user);
  // Get the unread count from our Redux store
  const { unreadCount } = useSelector((store) => store.notification);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // --- THIS IS THE FIX ---
  // This useEffect hook will run when the component mounts and periodically
  // fetch the unread notification count from the backend.
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        // Only fetch if a user is logged in
        try {
          const res = await axios.get(
            `${API_BASE_URL}/notifications/unread-count`,
            {
              withCredentials: true,
            }
          );
          // Dispatch the count to our Redux store
          dispatch(setUnreadCount(res.data.count));
        } catch (error) {
          // We don't show a toast here because it's a background task
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };

    fetchUnreadCount(); // Fetch immediately when the component loads
    const intervalId = setInterval(fetchUnreadCount, 30000); // And then check again every 30 seconds

    // Cleanup function to stop the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [user, dispatch]);

  const logoutHandler = async () => {
    setIsLogoutModalOpen(false);
    dispatch(setLoading({ status: true, message: "Logging you out..." }));
    try {
      const res = await axios.get(`${API_BASE_URL}/user/logout`, {
        withCredentials: true,
      });
      dispatch(clearUser());
      toast.success(res.data.message);
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
            {/* Notification Badge */}
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
            <button className="w-full py-3 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600">
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
    </>
  );
};
export default Sidebar;
