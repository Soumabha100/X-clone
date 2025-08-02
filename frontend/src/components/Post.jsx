import React, { useState } from "react";
import Avatar from "react-avatar";
import { FaImages } from "react-icons/fa";
import { HiMiniGif } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../redux/tweetSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Post = () => {
    const [description, setDescription] = useState("");
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const postTweetHandler = async () => {
        if (!description.trim()) {
            toast.error("Please enter a description.");
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/tweet/create`, 
            {
                description: description,
                id: user?._id,
            }, 
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            // Construct the new tweet object for instant UI update
            const newTweetForStore = { ...res.data.tweet, userDetails: [user] };
            dispatch(addTweet(newTweetForStore));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post tweet.");
            console.error(error);
        }
        setDescription("");
    };

    return (
        <div className="w-full px-4 pt-4 border-b border-neutral-700">
            <div className="flex items-center pb-4">
                <div>
                    <Avatar
                        src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
                        size="40"
                        round={true}
                    />
                </div>
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full ml-4 text-lg bg-transparent border-none outline-none"
                    type="text"
                    placeholder="What's happening?"
                />
            </div>
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center justify-between gap-4">
                    <FaImages className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
                    <HiMiniGif className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
                    <MdEmojiEmotions className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
                    <RiCalendarScheduleFill className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
                </div>
                <button
                    onClick={postTweetHandler}
                    className="px-6 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600"
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default Post;
