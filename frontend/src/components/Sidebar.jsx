import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import LogoutModal from "./LogoutModal";
import { setUnreadCount } from "../redux/notificationSlice";
import { FaXTwitter } from "react-icons/fa6";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { FaUser, FaRegUser } from "react-icons/fa";
import { CiBookmark, CiLogout } from "react-icons/ci";
import { RiQuillPenFill } from "react-icons/ri";

const API_BASE_URL = "/api/v1";

const Sidebar = () => {
  const { user } = useSelector((store) => store.user);
  const { unreadCount } = useSelector((store) => store.notification);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { path: "/home", icon: GoHome, activeIcon: GoHomeFill, text: "Home" },
    {
      path: "/home/explore",
      icon: IoSearchOutline,
      activeIcon: IoSearch,
      text: "Explore",
    },
    {
      path: "/home/notifications",
      icon: IoNotificationsOutline,
      activeIcon: IoNotifications,
      text: "Notifications",
    },
    {
      path: `/home/profile/${user?._id}`,
      icon: FaRegUser,
      activeIcon: FaUser,
      text: "Profile",
    },
  ];

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/notifications/unread-count`,
            { withCredentials: true }
          );
          dispatch(setUnreadCount(res.data.count));
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      }
    };
    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, [user, dispatch]);

  const logoutHandler = async () => {
    setIsLogoutModalOpen(false);
    try {
      await axios.get(`${API_BASE_URL}/user/logout`, { withCredentials: true });
      dispatch(clearUser());
      toast.success("Logged out successfully.");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <>
      {/* --- Desktop Sidebar --- */}
      <div className="hidden md:block w-[20%] sticky top-0 h-screen pr-4">
        <div className="ml-5 mt-3">
          <Link to="/home">
            <FaXTwitter size={32} />
          </Link>
        </div>
        <div className="mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
              >
                {isActive ? (
                  <item.activeIcon size="28px" />
                ) : (
                  <item.icon size="28px" />
                )}
                <h1
                  className={`font-bold text-lg ${
                    isActive && "font-extrabold"
                  }`}
                >
                  {item.text}
                </h1>
              </Link>
            );
          })}
          <Link
            to="/home/bookmarks"
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <CiBookmark size="28px" />
            <h1 className="font-bold text-lg">Bookmarks</h1>
          </Link>
          <div
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full"
          >
            <CiLogout size="28px" />
            <h1 className="font-bold text-lg">Logout</h1>
          </div>
          <button className="w-full mt-4 py-3 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600">
            Post
          </button>
        </div>
      </div>

      {/* --- Mobile Bottom Navigation --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex-1 flex justify-center items-center h-full"
              >
                {item.text === "Notifications" && unreadCount > 0 && (
                  <span className="absolute top-2 right-6 w-5 h-5 bg-blue-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-black">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {isActive ? (
                  <item.activeIcon size="28px" />
                ) : (
                  <item.icon size="28px" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="md:hidden fixed bottom-20 right-5 z-50">
        <button className="p-4 bg-blue-500 rounded-full shadow-lg">
          <RiQuillPenFill size="24px" className="text-white" />
        </button>
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
