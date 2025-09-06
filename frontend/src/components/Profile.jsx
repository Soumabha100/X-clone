import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Tweet from "./Tweet";
import { setUser } from "../redux/userSlice";
import EditProfileModal from "./EditProfileModal";
import TweetSkeleton from "./TweetSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// This function will be used by React Query to fetch data
const fetchProfileAndTweets = async (profileUserId) => {
  const [profileRes, tweetsRes] = await Promise.all([
    axios.get(`${API_BASE_URL}/user/profile/${profileUserId}`, {
      withCredentials: true,
    }),
    axios.get(`${API_BASE_URL}/tweet/user/${profileUserId}`, {
      withCredentials: true,
    }),
  ]);
  return { profile: profileRes.data.user, userTweets: tweetsRes.data };
};

const Profile = () => {
  const { id: profileUserId } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user: loggedInUser } = useSelector((store) => store.user);

  // --- THE OPTIMIZATION ---
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", profileUserId],
    queryFn: () => fetchProfileAndTweets(profileUserId),
  });

  const profile = data?.profile;
  const userTweets = data?.userTweets || [];
  const isFollowing = loggedInUser?.following.includes(profileUserId);

  // --- OPTIMIZED FOLLOW/UNFOLLOW with React Query Mutations ---
  const followUnfollowMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await axios.post(
        `${API_BASE_URL}/user/${endpoint}/${profileUserId}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Update the logged-in user's state in Redux
      dispatch(setUser(data.user));
      // Invalidate and refetch the profile data to update follower counts
      queryClient.invalidateQueries(["profile", profileUserId]);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred.");
    },
  });

  if (isLoading) {
    return (
      <div className="w-full md:w-[60%] border-l border-r border-neutral-800 p-4">
        <TweetSkeleton /> <TweetSkeleton /> <TweetSkeleton />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-4 text-center w-full">Failed to load profile.</div>
    );
  }

  return (
    <>
      <div className="w-full md:w-[60%] border-l border-r border-neutral-800">
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
              profile.bannerImg ||
              "https://placehold.co/600x200/1DA1F2/FFFFFF?text=Banner"
            }
            alt="banner"
            className="w-full h-48 object-cover bg-neutral-800"
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
                onClick={() => followUnfollowMutation.mutate()}
                className={`px-4 py-1.5 rounded-full font-bold transition-colors duration-200 ${
                  isFollowing
                    ? "bg-transparent text-white border border-gray-500"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
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
