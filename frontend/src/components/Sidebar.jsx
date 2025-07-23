import './Sidebar.css';
import { RiTwitterXFill } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { CiCircleMore } from "react-icons/ci";

// Reusable component for sidebar options
function SidebarOption({ text, Icon }) {
  return (
    <div className="sidebarOption">
      {/* Render the icon using the Icon prop */}
      {Icon && <Icon size={26} />}
      <h2>{text}</h2>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      {/* X Logo */}
      <div className="sidebar__logo">
        <RiTwitterXFill size={30} />
      </div>

      {/* Sidebar Options */}
      <SidebarOption text="Home" Icon={GoHomeFill} />
      <SidebarOption text="Explore" Icon={FiSearch} />
      <SidebarOption text="Notifications" Icon={IoNotificationsOutline} />
      <SidebarOption text="Messages" Icon={HiOutlineEnvelope} />
      <SidebarOption text="Profile" Icon={IoPersonOutline} />
      <SidebarOption text="More" Icon={CiCircleMore} />

      {/* Post Button */}
      <button className="sidebar__post">Post</button>
    </div>
  );
}

export default Sidebar;