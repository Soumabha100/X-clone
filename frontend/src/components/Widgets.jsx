import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Avatar from "react-avatar";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const Widgets = () => {
  const [otherUsers, setOtherUsers] = useState(null);
  const { user: loggedInUser } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (loggedInUser?._id) {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/user/otheruser/${loggedInUser._id}`,
            { withCredentials: true }
          );
          setOtherUsers(res.data.otherUsers);
        } catch (error) {
          console.error("Failed to fetch other users:", error);
          setOtherUsers([]);
        }
      }
    };
    fetchOtherUsers();
  }, [loggedInUser]);

  return (
    // This container now controls its own visibility and width
    <div className="hidden lg:block w-[25%] pt-1 pl-4">
      <div className="flex items-center p-2 bg-neutral-800 rounded-full outline-none w-full">
        <FaSearch size={"20px"} className="text-neutral-500 ml-2" />
        <input
          type="text"
          className="bg-transparent outline-none px-2 w-full"
          placeholder="Search"
        />
      </div>

      <div className="p-4 mt-4 bg-neutral-800 rounded-2xl w-full">
        <h1 className="text-xl font-bold">Who to Follow</h1>
        {otherUsers === null ? (
          <p className="mt-4 text-sm text-neutral-500">Loading...</p>
        ) : otherUsers.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            No other users to show.
          </p>
        ) : (
          otherUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between mt-4"
            >
              <Link
                to={`/home/profile/${user._id}`}
                className="flex items-center"
              >
                <div className="mr-2">
                  <Avatar
                    src={user.profileImg}
                    name={user.name}
                    size="40"
                    round={true}
                  />
                </div>
                <div>
                  <h1 className="font-bold text-sm hover:underline">
                    {user.name}
                  </h1>
                  <p className="text-sm text-neutral-500">@{user.username}</p>
                </div>
              </Link>
              <div>
                <Link to={`/home/profile/${user._id}`}>
                  <button className="px-4 py-1.5 bg-white text-black rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                    Profile
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Widgets;
