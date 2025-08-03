import React from "react";
import Avatar from "react-avatar";
import { FaComment, FaHeart, FaBookmark, FaTrash } from "react-icons/fa"; // Import FaTrash
import { BiRepost } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux"; // Import useDispatch
import axios from "axios";
import toast from "react-hot-toast";
import { format } from 'timeago.js';
import { Link } from "react-router-dom";
import { removeTweet } from "../redux/tweetSlice"; // Import the new action

const API_BASE_URL = "http://localhost:8000/api/v1";

const Tweet = ({ tweet }) => {
    const { user: loggedInUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    
    const { description, like, userId: author, createdAt, _id: tweetId } = tweet;
    
    if (!author) return null;

    const likeOrDislikeHandler = async () => { /* ... (no change here) ... */ };

    // Delete tweet handler
    const deleteTweetHandler = async () => {
        // Optional: Add a confirmation dialog
        if (window.confirm("Are you sure you want to delete this tweet?")) {
            try {
                const res = await axios.delete(`${API_BASE_URL}/tweet/delete/${tweetId}`, {
                    withCredentials: true,
                });
                // Dispatch the action to remove the tweet from the store
                dispatch(removeTweet(tweetId));
                toast.success(res.data.message);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete tweet.");
                console.error(error);
            }
        }
    };

    return (
        <div className="flex p-4 border-b border-neutral-800">
            <Link to={`/home/profile/${author._id}`}>
                <Avatar name={author.name} size="40" round={true} className="cursor-pointer" />
            </Link>
            <div className="w-full px-3">
                <div className="flex items-center">
                    <Link to={`/home/profile/${author._id}`} className="flex items-center">
                        <h1 className="font-bold hover:underline cursor-pointer">{author.name}</h1>
                        <p className="px-2 text-neutral-500 hover:underline cursor-pointer">@{author.username}</p>
                    </Link>
                    <p className="text-neutral-600">·</p>
                    <p className="ml-1 text-neutral-500 hover:underline cursor-pointer">{format(createdAt)}</p>
                    
                    {/* Conditionally render the delete icon */}
                    {loggedInUser?._id === author._id && (
                        <div onClick={deleteTweetHandler} className="ml-auto p-2 rounded-full hover:bg-red-900/50 hover:text-red-500 cursor-pointer">
                            <FaTrash size="16px" />
                        </div>
                    )}
                </div>

                <div className="py-2"><p>{description}</p></div>

                <div className="flex justify-between my-3 text-neutral-500">
                    {/* ... (like, comment, repost buttons have no change) ... */}
                    <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500">
                        <FaComment size="18px" />
                        <p className="ml-2 text-sm">0</p>
                    </div>
                    <div className="flex items-center duration-200 cursor-pointer hover:text-green-500">
                        <BiRepost size="24px" />
                        <p className="ml-2 text-sm">0</p>
                    </div>
                    <div onClick={likeOrDislikeHandler} className="flex items-center duration-200 cursor-pointer hover:text-pink-600">
                        <FaHeart size="18px" className={like.includes(loggedInUser?._id) ? "text-pink-600" : ""} />
                        <p className="ml-2 text-sm">{like.length}</p>
                    </div>
                    <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500">
                        <FaBookmark size="18px" />
                        <p className="ml-2 text-sm">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tweet;
