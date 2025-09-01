import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Avatar from "react-avatar";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const API_BASE_URL = "/api/v1";

/**
 * The Widgets component displays the right-hand column of the application,
 * including a search bar and a "Who to Follow" section.
 */
const Widgets = () => {
  // State to hold the list of users to suggest for following.
  const [otherUsers, setOtherUsers] = useState([]);
  // Get the currently logged-in user's data from the Redux store.
  const { user: loggedInUser } = useSelector((store) => store.user);

  // This effect fetches the list of other users from the backend when the component mounts.
  useEffect(() => {
    const fetchOtherUsers = async () => {
      // Only fetch if a user is logged in.
      if (loggedInUser?._id) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/user/otheruser/${loggedInUser._id}`,
            {
              withCredentials: true,
            }
          );
          // Store the fetched users in the component's state.
          setOtherUsers(res.data.otherUsers);
        } catch (error) {
          console.error("Failed to fetch other users:", error);
        }
      }
    };
    fetchOtherUsers();
  }, [loggedInUser]); // Re-run the effect if the logged-in user changes.

  return (
    // Main container for the widgets column.
    <div className="w-[25%] pt-1 pl-4">
      {/* --- Search Bar --- */}
      <div className="flex items-center p-2 bg-neutral-800 rounded-full outline-none w-full">
        <FaSearch size={"20px"} className="text-neutral-500 ml-2" />
        <input
          type="text"
          className="bg-transparent outline-none px-2 w-full"
          placeholder="Search"
        />
      </div>

      {/* --- "Who to Follow" Section --- */}
      <div className="p-4 mt-4 bg-neutral-800 rounded-2xl w-full">
        <h1 className="text-xl font-bold">Who to Follow</h1>

        {/* Map over the 'otherUsers' array to dynamically render each user suggestion. */}
        {otherUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between mt-4"
          >
            <div className="flex items-center">
              <div className="mr-2">
                <Avatar
                src={user.profileImg}
                name={user.name}
                size="40"
                round={true} />
              </div>
              <div>
                <h1 className="font-bold text-sm">{user.name}</h1>
                <p className="text-sm text-neutral-500">@{user.username}</p>
              </div>
            </div>
            <div>
              {/* The button is now a Link that navigates to the user's profile page. */}
              <Link to={`/home/profile/${user._id}`}>
                <button className="px-4 py-1.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                  Profile
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Widgets;
