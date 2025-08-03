import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Tweet from "./Tweet";
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * The Profile component displays a user's profile page, including their details,
 * their list of tweets, and provides functionality to follow or unfollow them.
 */
const Profile = () => {
  // State to hold the profile data of the user being viewed.
  const [profile, setProfile] = useState(null);
  // State to hold the tweets posted by the profile user.
  const [userTweets, setUserTweets] = useState([]);

  // Get the currently logged-in user's data from the Redux store.
  const { user: loggedInUser } = useSelector((store) => store.user);
  // Get the user ID from the URL parameter (e.g., '/home/profile/:id').
  const { id: profileUserId } = useParams();
  const dispatch = useDispatch();

  // A boolean to determine if the logged-in user is currently following the profile user.
  const isFollowing = loggedInUser?.following.includes(profileUserId);

  /**
   * Handles the logic for following or unfollowing a user.
   */
  const followUnfollowHandler = async () => {
    // Prevent a user from following themselves.
    if (loggedInUser?._id === profileUserId) return;

    try {
      // Determine which API endpoint to call based on the current follow status.
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await axios.post(
        `${API_BASE_URL}/user/${endpoint}/${profileUserId}`,
        {
          id: loggedInUser?._id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Dispatch an action to update the logged-in user's data in the Redux store.
      // This ensures the UI (like the 'following' count) updates instantly.
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.error("Follow/Unfollow error:", error);
    }
  };

  // This effect fetches the profile details and the user's tweets when the component mounts
  // or when the user navigates to a different profile.
  useEffect(() => {
    const fetchProfileAndTweets = async () => {
      try {
        // Fetch the user's profile information.
        const profileRes = await axios.get(
          `${API_BASE_URL}/user/profile/${profileUserId}`,
          { withCredentials: true }
        );
        setProfile(profileRes.data.user);

        // Fetch the tweets belonging to this user.
        const tweetsRes = await axios.get(
          `${API_BASE_URL}/tweet/user/${profileUserId}`,
          { withCredentials: true }
        );
        setUserTweets(tweetsRes.data);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error("Fetch profile error:", error);
      }
    };
    fetchProfileAndTweets();
    // Re-run this effect if the profile ID in the URL changes or if the follow status changes.
  }, [profileUserId, isFollowing]);

  // Display a loading state while the profile data is being fetched.
  if (!profile)
    return (
      <div className="w-[50%] text-center p-8">
        <h1>Loading profile...</h1>
      </div>
    );

  return (
    <div className="w-full md:w-[50%] border-l border-r border-gray-800">
      <div>
        {/* --- Profile Header --- */}
        <div className="flex items-center py-2 px-2">
          <Link
            to="/home"
            className="p-2 rounded-full cursor-pointer hover:bg-neutral-800"
          >
            <IoMdArrowRoundBack size="24px" />
          </Link>
          <div className="ml-4">
            <h1 className="font-bold text-lg">{profile.name}</h1>
            <p className="text-neutral-500 text-sm">
              {userTweets.length} posts
            </p>
          </div>
        </div>
        {/* --- Banner and Avatar --- */}
        <img
          src="https://www.avalara.com/content/dam/assets/banners-and-backrounds/technology-partner-1.png"
          alt="banner"
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-52 ml-4">
          <Avatar
            src="https://w0.peakpx.com/wallpaper/672/902/HD-wallpaper-hide-face-girl-with-sunflower-hide-face-girl.jpg"
            size="140"
            round={true}
            className="border-4 border-black"
          />
        </div>
        {/* --- Action Buttons (Edit/Follow) --- */}
        <div className="text-right m-4 pt-16">
          {/* Conditionally render either the "Edit Profile" or "Follow/Following" button. */}
          {loggedInUser?._id === profile._id ? (
            <button className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-gray-700 bg-transparent font-bold border border-gray-500">
              Edit Profile
            </button>
          ) : (
            <button
              onClick={followUnfollowHandler}
              className={`px-4 py-1.5 rounded-full font-bold transition-colors duration-200 ${
                isFollowing
                  ? "cursor-pointer bg-transparent text-white border border-gray-500"
                  : " cursor-pointer bg-white text-black hover:bg-gray-200"
              }`}
              // These JavaScript events handle the intuitive hover effect for the "Following" state.
              onMouseEnter={(e) => {
                if (isFollowing) {
                  e.currentTarget.textContent = "Unfollow";
                  e.currentTarget.classList.add(
                    "bg-red-900/20",
                    "text-red-500",
                    "border-red-500"
                  );
                }
              }}
              onMouseLeave={(e) => {
                if (isFollowing) {
                  e.currentTarget.textContent = "Following";
                  e.currentTarget.classList.remove(
                    "bg-red-900/20",
                    "text-red-500",
                    "border-red-500"
                  );
                }
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
        {/* --- User Details --- */}
        <div className="m-4">
          <h1 className="text-xl font-extrabold">{profile.name}</h1>
          <p className="text-neutral-500">@{profile.username}</p>
        </div>
        <div className="m-4">
          <p>
            Full Stack Developer Mern✈️ || Problem solver by day, coder by
            night👩‍💻 || Coffee lover🍵||Join us with Code🖥️
          </p>
        </div>
        {/* --- Followers/Following Count --- */}
        <div className="flex gap-5 m-4">
          <div className="flex items-center space-x-1 cursor-pointer hover:underline">
            <p className="font-bold">{profile.following.length}</p>
            <p className="text-neutral-500">Following</p>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:underline">
            <p className="font-bold">{profile.followers.length}</p>
            <p className="text-neutral-500">Followers</p>
          </div>
        </div>
      </div>
      {/* --- User's Tweet Feed --- */}
      <div>
        {userTweets.map((tweet) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
