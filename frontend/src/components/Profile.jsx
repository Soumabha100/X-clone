import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Tweet from "./Tweet";
import { setUser } from "../redux/userSlice";
import EditProfileModal from "./EditProfileModal"; // Ensure this is imported

const API_BASE_URL = "/api/v1";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [userTweets, setUserTweets] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user: loggedInUser } = useSelector((store) => store.user);
  const { id: profileUserId } = useParams();
  const dispatch = useDispatch();

  const isFollowing = loggedInUser?.following.includes(profileUserId);

  const followUnfollowHandler = async () => {
    if (loggedInUser?._id === profileUserId) return;

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await axios.post(
        `${API_BASE_URL}/user/${endpoint}/${profileUserId}`,
        { id: loggedInUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // THIS IS THE FIX: Dispatch the action to update the user's state.
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.error("Follow/Unfollow error:", error);
    }
  };

  useEffect(() => {
    const fetchProfileAndTweets = async () => {
      try {
        const profileRes = await axios.get(
          `${API_BASE_URL}/user/profile/${profileUserId}`,
          { withCredentials: true }
        );
        setProfile(profileRes.data.user);

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
  }, [profileUserId]);

  if (!profile) {
    return (
      <div className="w-[50%] text-center p-8">
        <h1>Loading profile...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="w-full md:w-[50%] border-l border-r border-gray-800">
        <div>
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
          <img
            src={
              profile.bannerImg
                ? profile.bannerImg.replace(
                    "/upload/",
                    "/upload/w_600,f_auto,q_auto/"
                  )
                : "https://placehold.co/600x200/1DA1F2/FFFFFF?text=Banner"
            }
            alt="banner"
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-52 ml-4">
            <Avatar
              src={profile.profileImg}
              name={profile.name}
              size="140"
              round={true}
              className="border-4 border-black"
            />
          </div>
          <div className="text-right m-4 pt-16">
            {loggedInUser?._id === profile._id ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="cursor-pointer px-4 py-1.5 rounded-full hover:bg-gray-700 bg-transparent font-bold border border-gray-500"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={followUnfollowHandler}
                className={`px-4 py-1.5 rounded-full font-bold transition-colors duration-200 ${
                  isFollowing
                    ? "bg-transparent text-white border border-gray-500"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
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
          <div className="m-4">
            <h1 className="text-xl font-extrabold">{profile.name}</h1>
            <p className="text-neutral-500">@{profile.username}</p>
            <p className="mt-2">
              {profile.bio || "This user has not set a bio."}
            </p>
          </div>
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
        <div>
          {userTweets.map((tweet) => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))}
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
          user={profile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default Profile;
