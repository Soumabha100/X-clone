import React from "react";
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

const API_BASE_URL = "http://localhost:8000/api/v1";

const Sidebar = () => {
  // Get user data from the Redux store
  const { user } = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/logout`, { withCredentials: true });
      // Clear user data from the store on logout
      dispatch(clearUser());
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <div className="w-[20%] sticky top-0 h-screen">
      <div className="ml-5 mt-3"><Link to="/home"><FaXTwitter size={32} /></Link></div>
      <div className="mt-4">
        <Link to="/home" className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full">
          <GoHomeFill size="28px" /><h1 className="font-bold text-lg">Home</h1>
        </Link>
        <Link to="/home/explore" className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full">
          <FaSearch size="28px" /><h1 className="font-bold text-lg">Explore</h1>
        </Link>
        <Link to="/home/notifications" className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full">
          <IoMdNotifications size="28px" /><h1 className="font-bold text-lg">Notifications</h1>
        </Link>
        {/* The Profile link now dynamically uses the logged-in user's ID */}
        <Link to={`/home/profile/${user?._id}`} className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full">
          <FaUser size="28px" /><h1 className="font-bold text-lg">Profile</h1>
        </Link>
        <Link to="/premium" className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full">
          <FaHeart size="28px" /><h1 className="font-bold text-lg">Premium</h1>
        </Link>
        <div onClick={logoutHandler} className="flex items-center space-x-4 p-3 my-2 cursor-pointer hover:bg-neutral-800 rounded-full">
          <RiLogoutBoxRLine size="28px" /><h1 className="font-bold text-lg">Logout</h1>
        </div>
        <div className="mt-4"><button className="w-full py-3 text-lg font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600">Post</button></div>
      </div>
    </div>
  );
};
export default Sidebar;
