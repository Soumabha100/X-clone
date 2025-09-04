import React, { useState, useEffect, useRef } from "react";
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
import { FiMoreHorizontal } from "react-icons/fi";
import useWindowSize from "../hooks/useWindowSize";
import { openCreatePostModal } from "../redux/uiSlice";

const API_BASE_URL = "/api/v1";

const Sidebar = () => {
  const { user } = useSelector((store) => store.user);
  const { unreadCount } = useSelector((store) => store.notification);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const width = useWindowSize();
  const isDesktop = width >= 768;

  const handlePostClick = () => {
    dispatch(openCreatePostModal());
  };

  // Effect to close the menu if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

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
      {/* --- DESKTOP SIDEBAR --- */}
      {isDesktop && (
        <div className="md:w-[20%] sticky top-0 h-screen pr-4">
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
            <button
              onClick={handlePostClick}
              className="w-full mt-4 py-3 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* --- MOBILE UI --- */}
      {!isDesktop && (
        <>
          {/* POP-UP "MORE" MENU */}
          {isMoreMenuOpen && (
            <div
              ref={menuRef}
              className="absolute bottom-20 right-5 z-50 bg-black rounded-xl shadow-lg border border-neutral-800 animate-pop-in w-60"
            >
              <Link
                to="/home/bookmarks"
                onClick={() => setIsMoreMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-white hover:bg-neutral-900 rounded-t-xl"
              >
                <CiBookmark size="24px" />
                <span className="font-bold">Bookmarks</span>
              </Link>
              <div
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="flex items-center gap-4 px-4 py-3 text-red-500 cursor-pointer hover:bg-neutral-900 rounded-b-xl"
              >
                <CiLogout size="24px" />
                <span className="font-bold">Logout</span>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION BAR */}
          <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 z-40">
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
              {/* "MORE" BUTTON TO OPEN THE MENU */}
              <div
                onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                className="relative flex-1 flex justify-center items-center h-full cursor-pointer"
              >
                <FiMoreHorizontal size="28px" />
              </div>
            </div>
          </div>

          {/* FLOATING ACTION BUTTON (POST) */}
          <div
            onClick={handlePostClick}
            className="fixed bottom-20 right-5 z-40"
          >
            <button className="p-4 bg-blue-500 rounded-full shadow-lg">
              <RiQuillPenFill size="24px" className="text-white" />
            </button>
          </div>
        </>
      )}

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
